// User-facing messages (spec §5.5). Kept in Spanish on purpose: users read them.
import { MAX_BATCH_SIZE, MAX_LABEL_LENGTH, MAX_NAME_LENGTH } from "./limits.ts";

export const messages = {
  forbidden: () => "No tienes permiso para dar de alta privadas ni viviendas",
  emptyName: () => "Indica el nombre de la privada",
  nameTooLong: () => `El nombre de la privada admite como máximo ${MAX_NAME_LENGTH} caracteres`,
  invalidName: () => "El nombre de la privada tiene caracteres no permitidos",
  sectionNotFound: () => "La sección no existe",
  subdivisionAlreadyExists: (name: string) => `La privada ${name} ya existe en esta sección`,
  emptyBatch: () => "Indica al menos una vivienda",
  batchTooLarge: () => `Un lote admite como máximo ${MAX_BATCH_SIZE} viviendas`,
  subdivisionNotFound: () => "La privada no existe",
  emptyLabel: () => "Hay una vivienda sin identificador",
  labelTooLong: (label: string) => `La vivienda ${label} supera los ${MAX_LABEL_LENGTH} caracteres`,
  invalidCharacters: (visible: string) => `La vivienda ${visible} tiene caracteres no permitidos`,
  duplicateInBatch: (label: string) => `La vivienda ${label} está repetida en el lote`,
  unitAlreadyExists: (label: string) => `La vivienda ${label} ya existe`,
};
