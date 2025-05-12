
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Printer } from "lucide-react";

interface Result {
  id: string;
  name: string;
  address: string;
}

interface ResultsListProps {
  results: Result[];
}

const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
  if (!results.length) return <div className="text-center text-gray-500 py-4">Aucun résultat à afficher</div>;
  
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {results.map((res) => (
        <motion.div
          key={res.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="text-lg font-semibold">{res.name}</div>
              <div className="text-sm text-gray-500">{res.address}</div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="icon"><Heart size={16} /></Button>
                <Button variant="outline" size="icon"><Share2 size={16} /></Button>
                <Button variant="outline" size="icon"><Printer size={16} /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ResultsList;
