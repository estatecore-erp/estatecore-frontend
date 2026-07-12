import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/getInitials";
import { cn } from "@/lib/utils";

const UserAvatar = ({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) => (
  <Avatar className={cn("h-8 w-8", className)}>
    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
      {getInitials(name)}
    </AvatarFallback>
  </Avatar>
);

export default UserAvatar;
