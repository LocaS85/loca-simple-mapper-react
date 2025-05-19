
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Place } from '@/types';

interface PrintButtonProps {
  results: Place[];
}

const PrintButton: React.FC<PrintButtonProps> = ({ results }) => {
  const { toast } = useToast();

  const handlePrint = () => {
    // In a real implementation, this would generate a print-friendly view
    // For now, we'll just show a toast
    toast({
      title: "Impression",
      description: `Préparation de l'impression pour ${results.length} résultat(s)`,
    });

    // Example of how to print the current page
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Button
        variant="secondary"
        size="sm"
        className="bg-white shadow-md hover:bg-gray-100 flex gap-2 items-center"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4 text-gray-700" />
        <span className="text-gray-700">Imprimer</span>
      </Button>
    </div>
  );
};

export default PrintButton;
