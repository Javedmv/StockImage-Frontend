import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { ImageItem } from "./ImageGallery";

type ImageCardProps = {
  image: ImageItem;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onDelete?: (id: string) => void;         // Optional for new previews
  onDrop?: () => void;            // Optional for new previews
  onEdit?: (id: string, title: string) => void; // Optional for new previews
  editable?: boolean;                     // For inline title editing (new uploads)
  onEditTitle?: (newTitle: string) => void; // Callback for title change
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

  // 🟡 Drag-and-drop setup
  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
    end: () => {
        onDrop?.(); // Call drop callback when dragging ends
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

  drag(drop(refElement)); // Connect drag and drop to element

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(image.title);

  return (
    <div ref={refElement} className="bg-white rounded-xl p-4 shadow-md flex flex-col gap-2">
      <img
        src={image.imageUrl}
        alt={image.title}
        className="w-full h-48 object-cover rounded-md"
      />

      {editable ? (
        <input
          type="text"
          className="border px-2 py-1 rounded text-sm"
          value={image.title}
          onChange={(e) => onEditTitle?.(e.target.value)}
        />
      ) : isEditing ? (
        <input
          type="text"
          className="border px-2 py-1 rounded text-sm"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      ) : (
        <p className="text-center font-semibold">{image.title}</p>
      )}

      {!editable && (
        <div className="flex justify-between mt-2">
          {isEditing ? (
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => {
                if (onEdit && image._id) {
                  onEdit(image._id, newTitle);
                  setIsEditing(false);
                }
              }}
            >
              Save
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}

          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => {
              if (onDelete && image._id) {
                onDelete(image._id);
              }
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
