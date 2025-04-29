import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type AlertDialogProps = {
  isOpen: boolean;
  title: string;
  titleClassName?: string;
  description: string;
  descriptionClassName?: string;
  cancelLabel: string;
  cancelOnClick: () => void;
  actionLabel: string;
  actionOnClick: () => void;
}

const CustomAlertDialog = ({
  isOpen,
  title,
  titleClassName="",
  description,
  descriptionClassName="",
  cancelLabel,
  cancelOnClick,
  actionLabel,
  actionOnClick
}: AlertDialogProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn(titleClassName)}>{title}</AlertDialogTitle>
          <AlertDialogDescription className={cn(descriptionClassName)}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelOnClick}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={actionOnClick}>{actionLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CustomAlertDialog;
