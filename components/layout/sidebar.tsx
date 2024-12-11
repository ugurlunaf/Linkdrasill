"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MenuItem {
  id: number;
  href: string;
  label: string;
}

interface NewItem {
  href: string;
  label: string;
}

export default function Sidebar() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      const response = await fetch(
        "https://e4234b9d5ab2434c82b116d7acd6c0b0.api.mockbin.io/"
      );
      const menuData: MenuItem[] = await response.json();
      setMenu(menuData);
    };

    fetchMenu();
  }, []);

  const handleOnDragEnd = async (result: DropResult) => {
    setIsDragging(false); // Sürükleme durumunu sıfırla

    if (!result.destination) return;

    const items = Array.from(menu);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedMenu = items.map((item, index) => ({
      ...item,
      index, // Yeni index değerini ekliyoruz
    }));

    setMenu(updatedMenu);

    await fetch("https://e4234b9d5ab2434c82b116d7acd6c0b0.api.mockbin.io/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMenu),
    });
  };

  const handleOnClick = (href: string) => {
    if (!isDragging) {
      window.location.href = href; // Eğer sürükleme yapılmıyorsa yönlendir
    }
  };

  const [newItem, setNewItem] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Formun sayfayı yeniden yüklemesini engeller.

    console.log("Form submitted!", newItem); // Form verisini burada işleyebilirsiniz.

    // Formdan gelen veriyi işledikten sonra, dialog'u kapatmak için isDialogOpen durumunu false yapabilirsiniz
    setIsDialogOpen(false);
    setNewItem(""); // Form verisini sıfırlamak (isteğe bağlı)
  };

  return (
    <div className="w-48 h-full bg-slate-950 p-4">
      <DragDropContext
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleOnDragEnd}
      >
        <Droppable droppableId="menu">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {menu.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      onClick={() => handleOnClick(item.href)}
                      className={`bg-slate-500 hover:bg-slate-500/80 ease-in duration-100 text-white font-semibold px-4 py-2 rounded shadow 
                        ${
                          snapshot.isDragging
                            ? "cursor-grabbing"
                            : "cursor-grab hover:cursor-pointer"
                        }`}
                    >
                      <span>{item.label}</span>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mt-4 hover:bg-slate-900 ease-in duration-100 border-2 border-slate-500 text-slate-300 text-base !font-semibold rounded shadow">
            + Add Categorie
          </Button>
        </DialogTrigger>
        <form onSubmit={handleSubmit}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={newItem} // State'i input'a bağlayın
                  onChange={(e) => setNewItem(e.target.value)} // Kullanıcı yazdıkça state'i güncelleyin
                  placeholder="Enter menu item label..."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit">Create</Button> {/* submit butonu */}
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
