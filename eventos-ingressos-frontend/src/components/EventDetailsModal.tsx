import { useState } from "react";
import { Calendar, Clock, MapPin, Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";
import { useToast } from "@/hooks/use-toast";
import { PurchaseConfirmationModal } from "./PurchaseConfirmationModal";

interface EventDetailsModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

export const EventDetailsModal = ({ event, open, onClose }: EventDetailsModalProps) => {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [purchaseData, setPurchaseData] = useState<{ qrCode: string } | null>(null);

  if (!event) return null;

  const isSoldOut = event.capacity === 0;

  const handlePurchase = () => {
    // Simula a resposta da API de compra
    const mockApiResponse = {
      data: {
        id: Math.random().toString(36).substr(2, 9),
        qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA8XSURBVHic7d17sGVVfcDx7+8OAwMMMzwEBgYQQQFFHgqCPBQfqFErVqtYbU2rMe1orDG1adI0mrRp0kamSTpt0kc1ptU21dqqVWutj1ZFRUWQBwgCggjykAcDw2uYx8z0j3Xu3Jl778y9c+/Z+6y9z/p+Zv7Y957Ze699z1rrt9dee+21wTAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMw+hLa9IJ6BsPAscCh0x4HUZ+m4EngQ3AQ+VOiGEYhmEYhmEYE2PuAdS3GVgFvAZ4PXAccAiwAfgG8BvAHZNKnNEXVgOvBf4d8GrgWGBf4EngduBm4LeB+yaUPsMwDMMwDMMwpsPOFcZZCXwWOA94H+kKYM9l+18C/CHpKuElwKeA99ScRqOezgYuBa4ENgNPlredKfvzgU8ADwB3ALvNLZVGPa8BvkQqtFcDR1f8zoHAO4E7SX+XgyNlzqh2APDPJHueA5zTwe/+S9K/6Y6I0zXaWQX8PsmGPwWOrfj9Q4FfAZ4BPp5/0ozO7EtS3BXAO0n39a1cBVxNMmjvKMkzmtkX+DqpVPsy3Xnyzge+z/TLVR+4APgqqUXdY+z7u7cBN5KaAhqJ40n1918DNgH7lF8eDRxRYZwzSVcTb4+QPqNcFZxFqr0/QWo+uwx4D3AiqVbfl1RZnQhcDNwDnBYhtUYiSs+rEuD/AE+TroS+D+xVfud04HcqjLMB+Ke8EzY3ziDZ7Gekq7xF/o607b0cOBM4vvx8H9IVwZeBF2ZJ6ZwL2SO4C/gkcHD53W7T/4eketGhEVJoJPZhe03+dcpO/y7wKeBbpEK+bOztJG/0CaWvbzxOqgXPYmW5WqL0v4c8I3JaZt1G4BJS1fVw8k3/IuVs9d6IaZlZ6niBvwB2jfCTs4EvJwjkvhcYhWFzfzfJWP84cHzk35xF6gR0MamENoL1pK78R5HOl4eB68ljrxWp1c65EX5rpolagP8V+Avyt9R7hJSuwyL+5szRxEL/BeAscpeO9n3AUaRL2HXAyxKkZeaoW+j/W8J0HQT8D+CIhL85E0Qt9Iu8ifRIDk8w7rnYgudexO70m4gzgdvJf583tXgR+JfAmYnS0fMivz/Sm3VykP6Hpe8vHfWr2vQlScs08gng60TubNY2X+C1pKuRuXFf4Hs0f//bNSFNNk1fWPjXAG8AzmD5rqNVA/x2iZSmeaMO+r8A7jri+IcCjzC/nZB2YP/r9tLbB4IlcZaF/i3AzxWXjW+QmrYtz/Z/T/x0zQJ/QPxCf3OEcdRxYw2wcNzRzwKXB/zdqA/oTDn/tPAa+iuAvwRWs7L1/wGpM9i/jTC+MVnqoH8MqfleVb4a4L1zzusI+lC53yBs0M5vk7vQX0568GZW6f3Q/wpwJc0K/efBQ8A+88rt8jS1AL8E/D3Vb7E+Crxtxu51/xb4IsXtXYPv/hjwJ+VOSPyj0b/tPLe8M+lx5HdFTtsscgOwE7gL+ATpVrmNjwOvavy0TT8Xy/2+UrPf+cD3SJd38+o4UuvEnYDfBfZa9r2/B36qg/T1jT+NMK0L0+PQT5LO6yNHHPdlpL8FVGpB+EvSiQBbjyI+/5Xy3xfBN4ErgE2RxheLTua1T1V9nYC+l/4kv2v+j6XfbTrv6KOr/yzwNuAb5edOf++Z8nPdDmqt9MNK/0+UO2Xwr0gLKvSB3g/9w+VvaSSrGWL/v+2xLY3F8aSSH9LleFfRR3UyqSbfadn5Z+l/Hvr0NuAQ+n+R/sR//6+U+6lkb9IKN61+T+l3Iel/f+i8H5f71crzItm5+Pz/Q7k/hv4bSCWX/tf839h58f+v5X4wdI++UP7/dbl/U2fpMrLR++ZXs8T7xhhvgfpP6h1JevpuX+AUUtv4X6r7gzPG3wC/BPxS+flm0moxi+xH6h+wgVSxHUV6BPh9pIeFFjm99P+NcmcYQ+j95N+cOPV7k+Zje1Klsrz5+h/TFmQk6nT6mSX66PTTwsJfszCIVyYaxxhN6acFoJ3+b07hc9IPw+inhaad/p/N5XPRR6Wd/s9O63P0+ejj0E7/j+fyseinUTsR1Um/EuDNnfu0gQV+F/iVpF+Zh3ckSlPUn5k2er10r/rb0cfRK05t+F/dxf88TS1g/yD9s3MJnfR3k+Y/yUJJBuQqgHsD3yVdns6SV5Nu0/Yk3bb+aIuRdif9D99FajG1c+kc3lf+bwPwCOnR6cNJ/7y9SbcVnyItePIrpCX/BiVASwfwLZF+L9k4ovyb0p9NtDb/QOmfB8Km30g1LqR8eL6UvkjJ0Ap/kHQPszVxyvcjrePW1Pez3P8R6Z/5nwYeKz/fANxb+l9Juh97rPz/g+VnZ7VGG/zqSMl/PqXlnxq00XS/mnb8eRj4t8D6VFPiGEqr9oXST8pvnYD+b+VnnqLcD5X8kN6gU/dS0pqTu5X+l5T+AhqQfr20kMku/emgNX9v0no9VVtbjSo/CWklnCaL1C6lyrwWrzb3Y6cqFVh6fPW+4umxjfTuwG6R3pB9OUVVPO/E8/uQHpGtQx31gNJPQT2UkWZr+y+UJvtVXRZy0Pe0C/0uSc//NSStzNO0K+vDpV/XtHPwh0qPQ3+K5k9iNvlP/KhQRy/y1IG3M/t9DPgE6cpqp+L+riv/hvI/qerSfvHSlz0WqXZ/+TBp+be7SG/U0X9oHPU46yJVWpIdQ+raXvXJ0Lq/qZ4fnepUYP+3lP/k5Pqp2Db/VQr9Q0o/b6Ffoj4N2pV+CnmAFOD9SU3x6/yWnpKsu2zZsQ3+rxv1++rJqB7cqjvuOtDm/66Ur8I3lv49qvxWHf2vtv4M6UGafXLMbK5C/zzp/4J6FdH0s1B/Rf1v6f+P9Cs1rdS0UY+Sptez4vCvlh65ra+2/oepfwu1yH+WsIU+lE6AdyrvrFNP+qpLzG0prQdWq6n9N0tflf+o00Xvt1KvSJ8knS8Npvz9KryV8u+iU+rw90l1qL/P8u/q8u9v0e/pTl3tlfYE0u1elbfuPlj6g1Of/s1OiSd+p9y/NrdU7W7/5TT9HfU5gWfL/Y+W/jlJzvs2+g/Q/NacVTT9HaAO/1R+Ou1dTuiAl1Ko2l+s9If2vwz80x1K/8JET/+uwqc/1NW+yvyfkvRv2vQ9hPQs//7Jzv+28xJ0lRJ1eB38EWv/v0dfjjrohxnw/w7d/W1UtbVqar9s+j+g8L+h8C8c+v+k/KTV/x+fJP3Ln/8N1J1+0PTryeCD6d6G0Hj6G3WL1t16kP7b0hf690h60Hd9kvT/B4X+JVKqp4m6wr9M+p8U+oG/C0oPl0+VOvydpR9Kp5f+W5L+lqf/efkN/W2u0P+s/P7KlScv/XUK/cNL//1IP0Unrl6dNPG7lP6Phn6N9K8bOvwPyr+kSZPjf9bkvC/S/+pIc+E+Lae/C08qfCv0/0z6T0r/qZXD/0D5y+X1NUn+p+X/36G8pdTxp6D+VumfVPq3Sf+A0r9j5dDqtl51OO3oTxb6N5a+tP6d8v1h+lfpfzr060r/F0u/rvSr/v/TtfxzNOW8/0mp/4GU5/0o0v+Swv8y6WfT/Wd0jLr8/Z/S/zbp/9fSX1d+t+r/P2zr3+Wk9n9e/f8t6X86dPRPKf0/hf4h0j++9J8r/fI/9FTp/kT6/7X06v7/MqV/Y8Wp+oLS/5lh49fBP1/679H+v0v6t5f+Xcv+q7D+t0k/pHwDzgqnf/mVyvPhB3S+5Kv6z1dJ/30K/d1KrbrV39bR7y8/pxX+zyt/Pfws9eUe+9elP+z0aR39SeV/3Ck2vW/r/7TS/2b5/y+W/kMrh1d3yqeU/kND/zL1P1L6VedfVWV+mKY//+1I85Kr/r+t/GeW/rDS/4lhh79Y/q9a+N+t/edj1eb/x2Hjf03ZH3X+dXX7K8Mtn/+rSv+1of+vo/zfY+r/3NT+S0P/udJ/Q/n+NdD/pPI36fyP2vz/Kum/P/SfVfhvlv5Tiz8xZP6/Uu4vCzvvv6P0v7X8zv+X/h2lf27oP66prfpxn9ZK//eq5f+XDRt/ufrfTPpXlP8p8L9j+V9E9/3fXL4qub70J5X/e6T/3tKfofBz1P8nljv/36H+s8u+Tdt/+bRXvfpfa+v/rPz9tZV+rqLry91Y2Sm/Hv43K/8Ptf9q29eu+cvmv+k4w/Y/aqf/ksI/9PxfWfqfUf+Fyn9d+X/e8b+k9D9R/qbq/NtRn6l/X+m3KfzXR/rfLf2Ppfz8e8v/rPr/XdP0Lw772P+nQ/8apX+39A8vvzO08D9Y+iHl/9ryb4v0L5D+fyj/6eXntv3rff/q9H958Tlw79rp+5L9y+9+c/Wx51Km/S8v/Z2l1wXQw8vfUPdbp+1f89/F/C/l5vJ7w86/JeE/Tv0vlv51y/w1pf+u0qv/w8r/e3H5rxv+z6r/mtK/rPRbF34r/ftK7/6bhS+W/oby76S6/K9P+dZRf7ny/DxT+u9L+S8waqf/mtLvXfq7yz+08P+u8sLDk96n/N9U/q33/T9U+p9u/2+uc/qNZOpa8R+k3oXA3xCP/tLH0U7/J5R+cPj7lb/tf/jSP+j4c2D+qTSMeppeIZ9OarFX4v0r/7Cuo94e05XO5nJAL/S/XPr1MX9v2jhe+X+vwl/i/IP077X0/0N5e1GlNiUl/m9R/w+Wv+Hz+L9E/R+gve1fz+jM2/6/S/2Lq+5X1dY7V5b/b7L5fz+lv8b8/0D6H44fgWEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYxmT5/1lx8C6cXNa7AAAAAElFTkSuQmCC"
      }
    };

    setPurchaseData(mockApiResponse.data);
    setShowConfirmation(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <div className="relative aspect-[21/9] overflow-hidden bg-muted">
            <img
              src={event.file?.file_url}
              alt={event.title}
              className="object-cover w-full h-full"
            />
            {isSoldOut && (
              <Badge className="absolute top-6 right-6 bg-destructive text-destructive-foreground font-semibold text-base px-4 py-2">
                Esgotado
              </Badge>
            )}
          </div>

          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                {event.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground/70">Data</p>
                    <p className="font-medium text-foreground">
                      {new Date(event.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground/70">Horário</p>
                    <p className="font-medium text-foreground">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground/70">Capacidade</p>
                    <p className="font-medium text-foreground">
                      {isSoldOut ? 'Esgotado' : `${event.capacity} lugares disponíveis`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10">
                    <span className="text-lg font-bold text-accent">R$</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground/70">Valor</p>
                    <p className="font-bold text-xl text-foreground">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(event.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-display font-semibold mb-3">Sobre o evento</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                size="lg"
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base h-14"
                disabled={isSoldOut}
                onClick={handlePurchase}
              >
                {isSoldOut ? 'Esgotado' : 'Comprar Ingresso'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onClose}
                className="h-14 px-8"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      
      {purchaseData && (
        <PurchaseConfirmationModal
          open={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          qrCode={purchaseData.qrCode}
          eventTitle={event.title}
        />
      )}
    </Dialog>
  );
};
