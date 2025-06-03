import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { ImageItem } from "./ImageGallery";

type ImageCardProps = {
  image: ImageItem;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onDelete?: (id: string) => void;
  onDrop?: () => void;
  onEdit?: (id: string, title: string, imageFile?: File) => void;
  editable?: boolean;
  onEditTitle?: (newTitle: string) => void;
};

const ItemType = "IMAGE";

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  index,
  moveCard,
  onDelete,
  onDrop,
  onEdit,
  editable = false,
  onEditTitle
}) => {
  const refElement = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
    end: () => {
        onDrop?.();
    },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(refElement));

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(image.title);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewImagePreview(event.target?.result as string);
      setNewImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (onEdit && image._id) {
      onEdit(image._id, newTitle, newImageFile || undefined);
      setIsEditing(false);
      setNewImagePreview(null);
      setNewImageFile(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewTitle(image.title);
    setNewImagePreview(null);
    setNewImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleStartEdit = () => {
    setNewTitle(image.title);
    setIsEditing(true);
  };

  return (
    <div ref={refElement} className="bg-white rounded-xl p-4 shadow-md flex flex-col gap-2">
      <div className="relative group">
        <img
          src={newImagePreview || image.imageUrl}
          alt={image.title}
          className="w-full h-48 object-cover rounded-md"
        />
        
        {newImagePreview && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
            New Image
          </div>
        )}

        {!editable && !isEditing && (
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-3">
              <button
                className="bg-blue-950 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
                onClick={handleStartEdit}
              >
                Edit
              </button>
              <button
                className="bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
                onClick={() => {
                  if (onDelete && image._id) {
                    onDelete(image._id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        hidden
        onChange={handleImageChange}
      />

      {/* Title Editing */}
      {editable ? (
        <input
          type="text"
          className="border px-2 py-1 rounded text-sm"
          value={image.title}
          onChange={(e) => onEditTitle?.(e.target.value)}
        />
      ) : isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            className="w-full border px-2 py-1 rounded text-sm"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter image title"
          />
          
          <button
            className="w-full bg-gray-100 border border-dashed border-gray-400 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
            onClick={() => imageInputRef.current?.click()}
          >
            {newImageFile ? 'Change Selected Image' : 'Click to Change Image (Optional)'}
          </button>
          
          {newImageFile && (
            <p className="text-xs text-green-600">
              Selected: {newImageFile.name}
            </p>
          )}

          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button
              className="flex-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center font-semibold">{image.title}</p>
      )}
    </div>
  );
};

export default ImageCard;