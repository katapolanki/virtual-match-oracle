
import { TrendingUp, BarChart4, Zap } from "lucide-react";

export const MethodologyCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-4 border rounded-md">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium">Történelmi adatelemzés</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Az algoritmus több ezer korábbi mérkőzés adatait dolgozza fel, és azonosítja a leggyakoribb 
          mintázatokat, kimeneteleket és összefüggéseket a különböző fogadási piacokra vonatkozóan.
        </p>
      </div>

      <div className="p-4 border rounded-md">
        <div className="flex items-center gap-2 mb-3">
          <BarChart4 className="h-5 w-5 text-green-500" />
          <h3 className="font-medium">Csapat profilozás</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Minden csapatról részletes profilt készítünk, amely tartalmazza a győzelmi arányt, gólszerzési és kapott 
          gól statisztikákat, valamint az egymás elleni mérkőzések kimeneteleit és mintázatait.
        </p>
      </div>

      <div className="p-4 border rounded-md">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-5 w-5 text-amber-500" />
          <h3 className="font-medium">Mintázat azonosítás</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          A V-Sports bajnokságban 4 fő mintázatot azonosítottunk: Papírforma, Fordított, Félidő/Végeredmény és Kiszámíthatatlan.
          Az algoritmus minden mérkőzést besorol valamelyik mintázatba a történelmi adatok alapján.
        </p>
      </div>
    </div>
  );
};
