// hooks 中直接使用 vue 中的 APIs 即可
import { onMounted } from 'vue';

// 接收的选项
interface Options {
  el: string;
}

// 返回的选项
interface Return {
  Baseurl: string | null;
}

export default function (option: Options): Promise<Return> {
  return new Promise((resolve) => {
    onMounted(() => {
      // 获取图片 DOM
      const file: HTMLImageElement = document.querySelector(
        option.el
      ) as HTMLImageElement;
      // 在图片加载完成后，再进行  base64 转换
      file.onload = (): void => {
        resolve({
          Baseurl: toBase64(file)
        });
      };
    });

    const toBase64 = (el: HTMLImageElement): string => {
      // 创建 canvas
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      // 设置 canvas 宽高
      canvas.width = el.width;
      canvas.height = el.height;
      // 绘制图片
      ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
      // 通过这个函数，可以导出一个 base64 格式的图片
      return canvas.toDataURL('image/png');
    };
  });
}
