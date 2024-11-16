import { useState } from "react";
import { CircleSlash, Columns, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FigmaColumnCounter = () => {
  // This would be hooked up to Figma's selection API in the actual plugin
  const [columnCount, setColumnCount] = useState(null);
  const [hasSelection, setHasSelection] = useState(false);

  return (
    <div className="w-full max-w-sm p-4 space-y-4">
      {!hasSelection ? (
        <Alert variant="destructive" className="flex items-center space-x-2">
          <CircleSlash className="h-4 w-4" />
          <AlertDescription>
            Select an element to analyze its columns
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Columns className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Columns</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">{columnCount || "—"}</span>
              </div>
            </div>

            <div className="mt-4 flex items-start space-x-2 text-xs text-gray-500">
              <Info className="h-4 w-4 flex-shrink-0" />
              <p>Element must be inside a grid container to detect columns</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FigmaColumnCounter;
