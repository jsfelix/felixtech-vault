"use client";
import { Modal } from "flowbite-react";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import axios from "axios";
import { VaultItem } from "@/server/entities/VaultItem";

interface DeleteModalProps {
  openModal: string | undefined;
  setOpenModal: Dispatch<SetStateAction<string | undefined>>;
  item?: VaultItem;
  onSubmit: () => any;
  onClose?: () => any;
}

export const DeleteModal = ({
  openModal,
  setOpenModal,
  item,
  onSubmit,
  onClose,
}: DeleteModalProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [confirm, setConfirm] = useState("");

  const handleDelete = useCallback(async () => {
    try {
      if (item && confirm === "DELETE") {
        const userCredentials = localStorage.getItem("fv_uc");
        await axios.delete(`/api/v1/vault-item/${item.id}`, {
          headers: { Authorization: `Basic ${userCredentials}` },
        });
        setOpenModal(undefined);
        onSubmit();
        if (onClose) onClose();
      }
    } catch (err) {
      // todo
    }
  }, [confirm, item, onClose, onSubmit, setOpenModal]);

  return (
    <div ref={rootRef}>
      <Modal
        root={rootRef.current ?? undefined}
        size="lg"
        show={openModal === "default"}
        onClose={() => {
          setOpenModal(undefined);
          if (onClose) onClose();
        }}
      >
        <Modal.Header className="bg-slate-700 border-none">
          <span className="text-zinc-100">Delete Item</span>
        </Modal.Header>
        <Modal.Body className="bg-zinc-900 border-b-zinc-700 flex flex-col gap-3">
          <p>
            Are you sure you want to delete item {item?.name}? To confirm, type{" "}
            <span className="font-bold">DELETE</span>:
          </p>
          <input
            type="text"
            id="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder=""
            autoFocus
            className="p-2 bg-zinc-800 border-zinc-800 border-2 rounded-md focus:border-blue-500"
          />
        </Modal.Body>
        <Modal.Footer className="bg-zinc-900 flex justify-end gap-3 border-t-zinc-700">
          <button
            className="p-2 border border-zinc-700 w-24 hover:bg-zinc-800 transition-all rounded-md"
            onClick={() => {
              setOpenModal(undefined);
              if (onClose) onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="p-2 border border-zinc-700 bg-slate-700 w-24 hover:bg-slate-800 transition-all cursor-pointer rounded-md"
            onClick={handleDelete}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
