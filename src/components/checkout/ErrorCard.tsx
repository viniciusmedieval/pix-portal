
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorCardProps {
  title: string;
  description: string;
  message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ title, description, message }) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          {message}
        </p>
      </CardContent>
      <CardFooter>
        <Link to="/" className="w-full">
          <Button className="w-full">Ir para Página Inicial</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ErrorCard;
