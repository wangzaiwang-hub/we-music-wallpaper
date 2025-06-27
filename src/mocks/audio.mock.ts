const audioModules = import.meta.glob('/public/audio/*.mp3');

const audioFiles = Object.keys(audioModules).map(path => {
  const fileName = path.split('/').pop()?.replace('.mp3', '') || '';
  return {
    id: fileName,
    name: fileName,
    src: path.replace('/public', ''),
  };
});

export default audioFiles; 