import React, { useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "./ui/dialog";
import { Button } from "./ui/button";

const AreYouSure = ({
  trigger,
  description,
  title,
  onClickFunction,
}: {
  trigger: React.ReactNode;
  description: string;
  title: string;
  onClickFunction: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (setIsOpen(open))}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}>
            Cancel
          </DialogClose>
          <Button onClick={onClickFunction}>Ok</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AreYouSure;
