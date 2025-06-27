import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';

interface PlaybackStatusContextType {
  registerPlaying: (id: string) => void;
  unregisterPlaying: (id: string) => void;
  isAnyAudioPlaying: boolean;
}

const PlaybackStatusContext = createContext<PlaybackStatusContextType | undefined>(
  undefined,
);

export const PlaybackStatusProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [playingSources, setPlayingSources] = useState<Set<string>>(new Set());

  const registerPlaying = useCallback((id: string) => {
    setPlayingSources((prev) => new Set(prev).add(id));
  }, []);

  const unregisterPlaying = useCallback((id: string) => {
    setPlayingSources((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const isAnyAudioPlaying = playingSources.size > 0;

  return (
    <PlaybackStatusContext.Provider
      value={{ registerPlaying, unregisterPlaying, isAnyAudioPlaying }}
    >
      {children}
    </PlaybackStatusContext.Provider>
  );
};

export const usePlaybackStatus = () => {
  const context = useContext(PlaybackStatusContext);
  if (!context) {
    throw new Error(
      'usePlaybackStatus must be used within a PlaybackStatusProvider',
    );
  }
  return context;
}; 