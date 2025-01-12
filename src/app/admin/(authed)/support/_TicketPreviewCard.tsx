import { Eye } from "lucide-react";
import Loading from "~/app/loading";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

const TicketPreviewCard = ({ ticketId }: { ticketId: number }) => {
  const { data, isLoading } = api.support.fetchTicketById.useQuery({
    ticketId,
  });

  if (isLoading) return <Loading />;

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <Eye />
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pr-4">
          <DialogTitle className="text-sm font-medium">
            Ticket Preview
          </DialogTitle>
          <Badge variant="outline" className="capitalize">
            {data?.ticketStatus}
          </Badge>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-lg font-semibold">
              {data?.reason.supportReason.title}
            </h3>
            <p className="text-sm text-muted-foreground">Ticket #{ticketId}</p>
          </div>
          <p className="text-sm">{data?.issue}</p>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="Avatar"
              />
              <AvatarFallback>
                {data?.user.name
                  .split(" ")
                  .map((word) => word.at(0))
                  .join("")
                  .toString()
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {data?.user.name} (
                {data?.user.kycDetails?.companyInfo?.companyName})
              </p>
              <p className="text-xs text-muted-foreground">
                {data?.user.email}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketPreviewCard;
