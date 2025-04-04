
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Lock, Unlock } from "lucide-react"

export function EnigmaDecryptionSection() {
  const [ciphertext, setCiphertext] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [decryptionProgress, setDecryptionProgress] = useState(0)
  const [decryptedText, setDecryptedText] = useState("")
  const [decryptionComplete, setDecryptionComplete] = useState(false)

  const startDecryption = () => {
    if (!ciphertext.trim()) return
    
    setIsDecrypting(true)
    setDecryptionProgress(0)
    setDecryptedText("")
    setDecryptionComplete(false)
    
    // Simulate decryption process
    let progress = 0
    const totalSteps = 20
    const interval = setInterval(() => {
      progress += 1
      setDecryptionProgress(Math.round((progress / totalSteps) * 100))
      
      if (progress >= totalSteps) {
        clearInterval(interval)
        setIsDecrypting(false)
        setDecryptionComplete(true)
        
        // Simple mock decryption - in reality this would use a real algorithm
        const simpleDecrypt = (text: string) => {
          // Just a mock transformation to simulate decryption
          return text
            .split("")
            .map(char => {
              const code = char.charCodeAt(0)
              // Simple transformation - shift characters by 1 position
              return String.fromCharCode(code > 32 ? code - 1 : code)
            })
            .join("")
        }
        
        setDecryptedText(simpleDecrypt(ciphertext))
      }
    }, 150)
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Enigma Kódfejtő Eszköz</CardTitle>
          <CardDescription>Dekódold a titkosított üzeneteket a virtuális mérkőzésekhez</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <label htmlFor="ciphertext" className="block text-sm font-medium mb-2">
                Titkosított szöveg
              </label>
              <Input
                id="ciphertext"
                placeholder="Írd be a titkosított szöveget..."
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                disabled={isDecrypting}
                className="mb-4"
              />
              <Button onClick={startDecryption} disabled={isDecrypting || !ciphertext.trim()}>
                {isDecrypting ? "Dekódolás folyamatban..." : "Dekódolás indítása"}
              </Button>
            </div>

            {(isDecrypting || decryptionComplete) && (
              <div className="mt-6">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm font-medium">Kódfejtési folyamat</span>
                  <span className="text-sm">{decryptionProgress}%</span>
                </div>
                <Progress value={decryptionProgress} className="h-2 mb-4" />

                {isDecrypting && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-medium">Enigma kód feltörése folyamatban...</span>
                  </div>
                )}

                {decryptionComplete && (
                  <>
                    <Alert className="mb-4 bg-green-50 border-green-200">
                      <Unlock className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Kódfejtés sikeres</AlertTitle>
                      <AlertDescription className="text-green-700">
                        Az Enigma kód sikeresen feltörve. A dekódolt üzenet alább olvasható.
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-black/5 rounded-md">
                      <h3 className="font-medium mb-2">Dekódolt üzenet:</h3>
                      <p className="font-mono text-sm">{decryptedText}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enigma Kódfejtés Útmutató</CardTitle>
          <CardDescription>Hogyan fejts meg titkosított üzeneteket</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              Az Enigma kódfejtő algoritmus segít megfejteni a virtuális mérkőzésekhez kapcsolódó titkosított üzeneteket. 
              Ezek az üzenetek gyakran tartalmaznak értékes információkat a jövőbeli mérkőzésekről.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Másold be a titkosított szöveget a fenti mezőbe.</li>
              <li>Kattints a "Dekódolás indítása" gombra.</li>
              <li>Az algoritmus megpróbálja feltörni az Enigma kódot.</li>
              <li>A sikeres dekódolás után az üzenet olvasható formában jelenik meg.</li>
            </ol>
            <p className="mt-4 text-muted-foreground">
              Megjegyzés: A valódi Enigma kódfejtés rendkívül bonyolult matematikai művelet, ami nagy számítási teljesítményt igényel.
              Ez a szimuláció leegyszerűsített formában mutatja be a folyamatot.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
