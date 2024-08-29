import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

export function WalletModal({
  open,
  setOpen,
  onWalletClick,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onWalletClick: (wallet: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-2">Connect Wallet</DialogTitle>
          <DialogDescription>
            Start by connecting with one of the wallets below.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <Button variant="outline" className="w-full justify-start h-auto mb-3" onClick={() => onWalletClick("freighter")}>
            <div className="flex items-center">
              <img className="mr-4" alt="freighter icon" src="https://i.epvpimg.com/o9f6fab.png" />
              <p className="text-lg">Freighter</p>
            </div>
          </Button>
          <Button variant="outline" className="w-full justify-start h-auto mb-3" onClick={() => onWalletClick("xbull")}>
            <div className="flex items-center">
              <img className="mr-4 max-w-[37px]" alt="freighter icon" src="https://i.epvpimg.com/wYBJfab.png" />
              <p className="text-lg">xBull</p>
            </div>
          </Button>
          <Button variant="outline" className="w-full justify-start h-auto" onClick={() => onWalletClick("lobstr")}>
            <div className="flex items-center">
              <img className="mr-4 max-w-[37px]" alt="freighter icon" src="https://raw.githubusercontent.com/Lobstrco/lobstr-browser-extension/main/extension/public/static/images/icon128.png" />
              <p className="text-lg">Lobstr</p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
