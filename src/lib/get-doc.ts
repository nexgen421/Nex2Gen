import { type DocumentType } from "./types";
import axios from "axios";

export const getDocName = (docType: DocumentType, id: string): string => {
  return `${id}-${docType}`;
};

export const getDoc = async (id: string, docType: DocumentType) => {
  const fileName = getDocName(docType, id);

  try {
    return await axios.get<{ presignedUrl: string }>(
      `/api/get-presigned-url?fileName=${fileName}&docType=${docType}`,
    );
  } catch (error) {
    throw error;
  }
};
