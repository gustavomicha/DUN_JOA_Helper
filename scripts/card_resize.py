from PIL import Image
import os

def process_images(folder_path, max_size=(372, 518), quality=50):
    """
    Processes images to make them lighter and smaller.
    
    Args:
    - folder_path: The path to the folder containing images.
    - max_size: Tuple (max_width, max_height) to which images will be resized if they are larger.
    - quality: Quality of the saved image (1-100) where higher means better quality but larger file.
    """
    # Ensure the Pillow library is available
    try:
        from PIL import Image
    except ImportError:
        raise ImportError("Pillow library is not installed. Install it using 'pip install Pillow'")
    
    # Create the new folder
    new_folder_path = f"{folder_path}_lighter"
    if not os.path.exists(new_folder_path):
        os.makedirs(new_folder_path)
    
    # Process each image in the folder
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            try:
                img_path = os.path.join(folder_path, filename)
                img = Image.open(img_path)
                
                # Resize the image
                img.thumbnail(max_size, Image.ANTIALIAS)
                
                # Save the image to the new folder
                new_img_path = os.path.join(new_folder_path, filename)
                img.save(new_img_path, quality=quality, optimize=True)
                print(f"Processed and saved: {new_img_path}")
            except Exception as e:
                print(f"Failed to process {filename}: {e}")

# Example usage
folder = "assets/cards/poder"
process_images(folder)
