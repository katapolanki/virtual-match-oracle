
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Goal, Shield } from "lucide-react";

export const MethodologySection = () => {
  return (
    <>
      <CardHeader>
        <CardTitle>Elemzési Módszertan</CardTitle>
        <CardDescription>Hogyan határozzuk meg a "mindkét csapat betalál" valószínűségét</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-md">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Egymás elleni mérkőzések</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Az algoritmus elemzi a csapatok egymás elleni mérkőzéseit, és kiszámítja, hogy ezeken a mérkőzéseken
              milyen arányban talált be mindkét csapat. Ez a legfontosabb tényező, 60% súllyal szerepel a végső
              valószínűség kiszámításában.
            </p>
          </div>

          <div className="p-4 border rounded-md">
            <div className="flex items-center gap-2 mb-3">
              <Goal className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Gólszerzési képesség</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Figyelembe vesszük a csapatok átlagos gólszerzési képességét. Ha a hazai csapat átlagosan legalább 1.0
              gólt szerez, a vendég csapat pedig legalább 0.8 gólt meccsenként, az növeli a "mindkét csapat betalál"
              valószínűségét.
            </p>
          </div>

          <div className="p-4 border rounded-md">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-red-500" />
              <h3 className="font-medium">Védekezési képesség</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              A csapatok védekezési képességét is elemezzük. Ha a hazai csapat átlagosan legalább 0.8 gólt kap, a
              vendég csapat pedig legalább 1.0 gólt meccsenként, az szintén növeli a "mindkét csapat betalál"
              valószínűségét.
            </p>
          </div>
        </div>
      </CardContent>
    </>
  );
};
