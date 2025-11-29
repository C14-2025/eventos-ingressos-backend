import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PurchaseConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  qrCode: string;
  eventTitle: string;
}

export const PurchaseConfirmationModal = ({
  open,
  onClose,
  qrCode,
  eventTitle,
}: PurchaseConfirmationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Compra Confirmada</DialogTitle>
        </DialogHeader>

        <div className="p-8 space-y-6 text-center">
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold">
              Compra Confirmada!
            </h2>
            <p className="text-muted-foreground">
              Seu ingresso para <span className="font-semibold text-foreground">{eventTitle}</span> foi
              adquirido com sucesso.
            </p>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg">
            <p className="text-sm text-muted-foreground mb-4">
              Apresente este QR Code na entrada do evento:
            </p>
            <div className="bg-white p-4 rounded-lg inline-block">
              <img
                src={qrCode}
                alt="QR Code do ingresso"
                className="w-64 h-64 mx-auto"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={() => {
                const link = document.createElement("a");
                link.href = qrCode;
                link.download = "ingresso-evento.png";
                link.click();
              }}
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar Ingresso
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
