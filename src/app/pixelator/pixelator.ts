import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pixelator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pixelator.html',
  styleUrl: './pixelator.scss',
})
export class PixelatorComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('originalCanvas') originalCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pixelatedCanvas') pixelatedCanvas!: ElementRef<HTMLCanvasElement>;

  originalImage: string | null = null;
  pixelatedImage: string | null = null;
  pixelatedWidth: number | null = null;
  outputHeight: number = 64;
  isDragOver: boolean = false;
  extractedColors: string[] = [];
  colorFrequency: Map<string, number> = new Map();
  colorTolerance: number = 0;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      alert('Selecteer een afbeeldingsbestand');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.originalImage = e.target?.result as string;
      this.pixelatedImage = null;
      this.pixelatedWidth = null;

      // Wait until Angular has rendered the original canvas after the upload.
      setTimeout(() => this.drawOriginalPreview());
    };
    reader.readAsDataURL(file);
  }

  private drawOriginalPreview(): void {
    if (!this.originalImage || !this.originalCanvas) return;

    const img = new Image();
    img.onload = () => {
      const canvas = this.originalCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = this.originalImage;
  }

  pixelate(): void {
    if (!this.originalImage) return;
    this.normalizeOutputHeight();

    const img = new Image();
    img.onload = () => {
      // Draw original image on original canvas
      const originalCtx = this.originalCanvas.nativeElement.getContext('2d');
      if (originalCtx) {
        this.originalCanvas.nativeElement.width = img.width;
        this.originalCanvas.nativeElement.height = img.height;
        originalCtx.drawImage(img, 0, 0);
      }

      // Pixelate on pixelated canvas
      const pixelatedCtx = this.pixelatedCanvas.nativeElement.getContext('2d');
      if (pixelatedCtx) {
        const outputHeight = Math.max(1, Math.round(this.outputHeight));
        const outputWidth = Math.max(1, Math.round(img.width * (outputHeight / img.height)));

        this.pixelatedCanvas.nativeElement.width = outputWidth;
        this.pixelatedCanvas.nativeElement.height = outputHeight;
        pixelatedCtx.imageSmoothingEnabled = false;
        pixelatedCtx.drawImage(img, 0, 0, outputWidth, outputHeight);

        // Apply the saved palette after resizing, so the final pixels are mapped.
        if (this.extractedColors.length > 0) {
          this.applySavedPalette(pixelatedCtx, outputWidth, outputHeight);
        }

        this.pixelatedWidth = outputWidth;
        this.pixelatedImage = this.pixelatedCanvas.nativeElement.toDataURL();
      }
    };
    img.src = this.originalImage;
  }

  private applySavedPalette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const palette = this.extractedColors
      .map((color) => this.hexToRgb(color))
      .filter((color): color is [number, number, number] => color !== null);

    if (palette.length === 0) return;

    for (let i = 0; i < data.length; i += 4) {
      // Leave transparent pixels untouched.
      if (data[i + 3] === 0) continue;

      const closestColor = this.findNearestPaletteColor(data[i], data[i + 1], data[i + 2], palette);
      data[i] = closestColor[0];
      data[i + 1] = closestColor[1];
      data[i + 2] = closestColor[2];
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private findNearestPaletteColor(
    red: number,
    green: number,
    blue: number,
    palette: [number, number, number][],
  ): [number, number, number] {
    let nearestColor = palette[0];
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const paletteColor of palette) {
      const redDifference = red - paletteColor[0];
      const greenDifference = green - paletteColor[1];
      const blueDifference = blue - paletteColor[2];
      const distance =
        redDifference * redDifference +
        greenDifference * greenDifference +
        blueDifference * blueDifference;

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestColor = paletteColor;
      }
    }

    return nearestColor;
  }

  normalizeOutputHeight(): void {
    const height = Number(this.outputHeight);
    this.outputHeight = Number.isFinite(height)
      ? Math.min(512, Math.max(8, Math.round(height)))
      : 64;
  }

  downloadPixelated(): void {
    if (!this.pixelatedImage) return;

    const link = document.createElement('a');
    link.href = this.pixelatedImage;
    link.download = 'pixelated-image.png';
    link.click();
  }

  reset(): void {
    this.originalImage = null;
    this.pixelatedImage = null;
    this.pixelatedWidth = null;
    this.extractedColors = [];
    this.colorFrequency.clear();
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  extractColors(): void {
    if (!this.originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      this.colorFrequency.clear();

      // Extract all unique colors with tolerance clustering
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Find the closest color within tolerance
        const closestColor = this.findClosestColor([r, g, b]);

        if (this.colorFrequency.has(closestColor)) {
          this.colorFrequency.set(closestColor, (this.colorFrequency.get(closestColor) || 0) + 1);
        } else {
          this.colorFrequency.set(closestColor, 1);
        }
      }

      // Sort colors in a visual color order instead of by pixel frequency.
      this.extractedColors = Array.from(this.colorFrequency.entries())
        .sort(([colorA], [colorB]) => this.compareColors(colorA, colorB))
        .map(([color]) => color);
    };
    img.src = this.originalImage;
  }

  private findClosestColor(rgb: [number, number, number]): string {
    // If no tolerance, just convert to hex
    if (this.colorTolerance === 0) {
      return this.rgbToHex(rgb[0], rgb[1], rgb[2]);
    }

    // Find existing color within tolerance
    for (const [hexColor] of this.colorFrequency.entries()) {
      const existingRgb = this.hexToRgb(hexColor);
      if (existingRgb && this.isWithinTolerance(rgb, existingRgb)) {
        return hexColor;
      }
    }

    // No similar color found, create new one
    return this.rgbToHex(rgb[0], rgb[1], rgb[2]);
  }

  private isWithinTolerance(rgb1: [number, number, number], rgb2: [number, number, number]): boolean {
    const tolerance = this.colorTolerance;
    return (
      Math.abs(rgb1[0] - rgb2[0]) <= tolerance &&
      Math.abs(rgb1[1] - rgb2[1]) <= tolerance &&
      Math.abs(rgb1[2] - rgb2[2]) <= tolerance
    );
  }

  private hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? ([parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)])
      : null;
  }

  private compareColors(colorA: string, colorB: string): number {
    const rgbA = this.hexToRgb(colorA);
    const rgbB = this.hexToRgb(colorB);

    if (!rgbA || !rgbB) return colorA.localeCompare(colorB);

    const hslA = this.rgbToHsl(rgbA);
    const hslB = this.rgbToHsl(rgbB);

    // Neutral colors (gray, black and white) come after chromatic colors.
    const neutralOrder = Number(hslA[1] === 0) - Number(hslB[1] === 0);
    if (neutralOrder !== 0) return neutralOrder;

    // Hue order: red, orange, yellow, green, cyan, blue, purple, pink.
    if (hslA[0] !== hslB[0]) return hslA[0] - hslB[0];
    if (hslA[1] !== hslB[1]) return hslB[1] - hslA[1];
    return hslA[2] - hslB[2];
  }

  private rgbToHsl(rgb: [number, number, number]): [number, number, number] {
    const red = rgb[0] / 255;
    const green = rgb[1] / 255;
    const blue = rgb[2] / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;

    if (max === min) return [0, 0, lightness];

    const delta = max - min;
    const saturation = lightness > 0.5
      ? delta / (2 - max - min)
      : delta / (max + min);
    let hue: number;

    switch (max) {
      case red:
        hue = (green - blue) / delta + (green < blue ? 6 : 0);
        break;
      case green:
        hue = (blue - red) / delta + 2;
        break;
      default:
        hue = (red - green) / delta + 4;
    }

    return [hue * 60, saturation, lightness];
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
        .toUpperCase()
    );
  }

  copyToClipboard(color: string): void {
    navigator.clipboard.writeText(color).then(() => {
      alert('Kleur gekopieerd: ' + color);
    });
  }

  removeColor(color: string, event: MouseEvent): void {
    event.stopPropagation();
    this.extractedColors = this.extractedColors.filter((savedColor) => savedColor !== color);
    this.colorFrequency.delete(color);
  }

  downloadColorsAsJSON(): void {
    if (this.extractedColors.length === 0) return;

    const colorData = {
      timestamp: new Date().toISOString(),
      totalColors: this.extractedColors.length,
      colors: this.extractedColors.map((color) => ({
        hex: color,
        frequency: this.colorFrequency.get(color),
      })),
    };

    const dataStr = JSON.stringify(colorData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'colors-palette.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
