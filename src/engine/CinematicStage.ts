export class CinematicStage {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private images: HTMLImageElement[] = [];
    private pathPattern: string;
    private totalFrames: number;
    public currentFrame: number = 0;

    constructor(canvasId: string, totalFrames: number, pathPattern: string) {
        const el = document.getElementById(canvasId);
        if (!(el instanceof HTMLCanvasElement)) throw new Error(`Canvas #${canvasId} not found`);

        this.canvas = el;
        this.ctx = this.canvas.getContext('2d', { alpha: false })!;
        this.totalFrames = totalFrames;
        this.pathPattern = pathPattern;

        this.init();
    }

    private init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    private resize() {
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.render();
    }

    public async preload() {
        const promises = [];
        for (let i = 1; i <= this.totalFrames; i++) {
            const img = new Image();
            const src = this.pathPattern.replace('###', i.toString().padStart(3, '0'));
            img.src = src;
            promises.push(new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if some frames fail
            }));
            this.images.push(img);
        }
        await Promise.all(promises);
        this.render();
    }

    public render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const idx = Math.floor(Math.min(this.currentFrame, this.totalFrames - 1));
        const img = this.images[idx];

        if (!img || !img.complete || img.naturalWidth === 0) {
            this.drawPlaceholder();
            return;
        }

        const { width, height } = this.canvas;
        const iWidth = img.naturalWidth;
        const iHeight = img.naturalHeight;

        const hRatio = width / iWidth;
        const vRatio = height / iHeight;
        const ratio = Math.max(hRatio, vRatio);

        const offsetX = (width - iWidth * ratio) / 2;
        const offsetY = (height - iHeight * ratio) / 2;

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.ctx.drawImage(img, 0, 0, iWidth, iHeight, offsetX, offsetY, iWidth * ratio, iHeight * ratio);
    }

    private drawPlaceholder() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#050505');
        gradient.addColorStop(0.5, '#120205'); // Cardinal Pulse tint
        gradient.addColorStop(1, '#050505');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Add some noise for cinematic texture
        this.ctx.fillStyle = 'rgba(255,255,255,0.015)';
        for (let i = 0; i < 50; i++) {
            this.ctx.fillRect(Math.random() * this.canvas.width, Math.random() * this.canvas.height, 2, 2);
        }
    }
}
