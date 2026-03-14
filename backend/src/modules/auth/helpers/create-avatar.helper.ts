export const createAvatar = (name: string) => {
  const parseName = encodeURIComponent(name)
  return `https://ui-avatars.com/api/?name=${parseName}&background=random&bold=true`
}
