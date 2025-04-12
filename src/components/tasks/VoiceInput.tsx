
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    // Initialize speech recognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }
    
    const recognitionInstance = new SpeechRecognitionAPI();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const currentTranscript = event.results[current][0].transcript;
      setTranscript(currentTranscript);
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast.error('Speech recognition error. Please try again.');
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
    };
    
    setRecognition(recognitionInstance);
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      
      // Process final transcript
      if (transcript) {
        onTranscript(transcript);
      }
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
      toast.info('Listening... Speak now');
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-muted/50 rounded-md">
        <MicOff className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Voice input is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Voice Input</p>
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={toggleListening}
          className="flex items-center gap-1"
        >
          {isListening ? (
            <>
              <StopCircle className="h-4 w-4" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              <span>Start</span>
            </>
          )}
        </Button>
      </div>
      
      {isListening && (
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <Mic className="h-4 w-4 text-primary animate-pulse" />
          </div>
          <div className="border rounded-md bg-background p-3 pl-10 min-h-[60px] text-sm">
            {transcript || "Listening..."}
          </div>
        </div>
      )}
      
      {!isListening && transcript && (
        <div className="border rounded-md bg-background p-3 min-h-[60px] text-sm">
          {transcript}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
