import { z } from 'zod';

export const CreateShipmentValidator = z.object({
    awbNumber: z.string(),
    provider: z.string()
});

export type TCreateShipmentValidator = z.infer<typeof CreateShipmentValidator>;

export const TrackShipmentValidator = z.object({
    awbNumber: z.string()
});

export type TTrackShipmentValidator = z.infer<typeof TrackShipmentValidator>;

export const RemoveShipmentValidator = z.object({
    awbNumber: z.string()
});

export type TRemoveShipmentValidator = z.infer<typeof RemoveShipmentValidator>;

export const GetAllShipmentsValidator = z.object({
    offset: z.number().optional(),
    itemsPerPage: z.number().optional().default(10)
});

export type TGetAllShipmentValidator = z.infer<typeof GetAllShipmentsValidator>;