import React, { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import axios from "axios";
import ImageCard from "./ImageCard";
import useUserStore from "../store";
import { BACKEND_URL } from "../constant";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

export type ImageItem = {
  _id?: string;
  title: string;
  imageUrl: string;
  file?: File;
  isNew?: boolean;
};

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/images`, {
        withCredentials: true,
      });
      if (res.status === 200 && Array.isArray(res.data.images)) {
        setImages(res.data.images);
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  const handleDrop = async () => {
    const orderedImages = images.map((img, index) => ({
      id: img._id,
      order: index + 1,
    }));
  
    try {
      await axios.post(`${BACKEND_URL}/images/reorder`, { updates: orderedImages } , {withCredentials: true});
    } catch (error) {
      console.error('Failed to update image order:', error);
    }
  };

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragged = images[dragIndex];
      setImages(
        update(images, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragged],
          ],
        })
      );
    },
    [images]
  );

  const handleTitleChange = useCallback((index: number, newTitle: string) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages[index].title = newTitle;
      return newImages;
    });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const previews: ImageItem[] = await Promise.all(
      Array.from(files).map(async (file) => {
        const base64 = await convertToBase64(file);
        return {
          _id: uuidv4(),
          title: file.name.split(".")[0],
          imageUrl: base64 as string,
          file,
          isNew: true,
        };
      })
    );
    setImages((prev) => [...prev, ...previews]);
  };

  const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((img, index) => {
      if (img.isNew && img.file) {
        formData.append("images", img.file);
        formData.append("titles", img.title);
        formData.append("orders", String(index));
      }
    });

    try {
      const res = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success("Images uploaded successfully!");
        fetchImages();
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      toast.error(err.response?.data?.message || "Failed to upload images.");
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${BACKEND_URL}/images/${id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setImages((prev) => prev.filter((img) => img._id !== id));
        toast.success("Image deleted successfully.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to delete image.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }, []);

  const handleEdit = useCallback(async (id: string, title: string, imageFile?: File) => {
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", imageFile);
  
        const res = await axios.put(
          `${BACKEND_URL}/edit-images/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
  
        if (res.status === 200) {
          fetchImages();
          toast.success("Image and Title updated successfully!");
        }
      } else {
        const res = await axios.put(
          `${BACKEND_URL}/images/${id}`,
          { title },
          { withCredentials: true }
        );
  
        if (res.status === 200) {
          setImages((prev) =>
            prev.map((img) => (img._id === id ? { ...img, title } : img))
          );
          toast.success("Title updated successfully!");
        }
      }
    } catch (err: any) {
      console.error("Edit failed:", err);
      toast.success(err.response?.data?.message || "Failed to update.");
    }
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {capitalizeFirstLetter(user?.username!)}'s Image Gallery
        </h2>

        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="mb-4 bg-gray-700 hover:bg-blue-950 text-white font-semibold py-2 px-4 rounded-xl"
        >
          Select Images
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.length > 0 ? (
            images.map((img, index) => (
              <ImageCard
                key={img._id || index}
                image={img}
                index={index}
                moveCard={moveCard}
                onDrop={handleDrop}
                editable={img.isNew}
                onEditTitle={(newTitle) => handleTitleChange(index, newTitle)}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          ) : (
            <div className="text-center col-span-full text-gray-500">
              No images found.
            </div>
          )}
        </div>

        {images.some((img) => img.isNew) && (
          <button
            onClick={handleUpload}
            className="mt-6 w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-xl transition"
          >
            Upload Selected Images
          </button>
        )}
      </div>
    </DndProvider>
  );
};

export default ImageGallery;