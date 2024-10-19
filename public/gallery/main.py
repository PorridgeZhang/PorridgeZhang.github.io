import os
from PIL import Image

def calculate_aspect_ratio(image_path):
    """计算图像的横纵比"""
    with Image.open(image_path) as img:
        width, height = img.size
        return width / height if height != 0 else None

def is_image_file(filename):
    """判断文件是否是支持的图像格式"""
    extensions = ['.gif', '.jpg', '.jpeg', '.png']
    return any(filename.lower().endswith(ext) for ext in extensions)

def save_aspect_ratios_to_file(image_aspect_ratios, output_file):
    """将图像的名称和横纵比保存到txt文件"""
    with open(output_file, 'w') as f:
        for name, aspect_ratio in image_aspect_ratios.items():
            if aspect_ratio is not None:
                f.write(f"{name}: {aspect_ratio:.6f}\n")
            else:
                f.write(f"{name}: Invalid (height is 0)\n")

def main():
    # 获取当前目录下所有图像文件
    current_directory = os.getcwd()
    image_files = [f for f in os.listdir(current_directory) if is_image_file(f)]
    
    # 计算每个图像的横纵比
    image_aspect_ratios = {}
    for image_file in image_files:
        aspect_ratio = calculate_aspect_ratio(os.path.join(current_directory, image_file))
        image_aspect_ratios[image_file] = aspect_ratio
    
    # 将结果保存到 aspect_ratios.txt 文件中
    output_file = "aspect_ratios.txt"
    save_aspect_ratios_to_file(image_aspect_ratios, output_file)
    print(f"横纵比已保存到 {output_file}")

if __name__ == "__main__":
    main()
