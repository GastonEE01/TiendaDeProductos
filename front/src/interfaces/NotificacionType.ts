export interface NotificacionProducto {
  id: string;
  quantity: number;
  unitPrice: number;
  name: string;
  img: string;
}

export interface NotificacionDtoResponse {
  id: string;
  message: string;
  state: "Unread" | "Read";
  creationDate: string;
  orderState: "Approved" | "Shipped" | "Delivered"; 
   ordenId: string; 
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  total: number;
  productos: NotificacionProducto[];
}
