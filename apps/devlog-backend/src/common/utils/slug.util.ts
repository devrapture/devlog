import slugify from 'slugify';

export const generateSlug = (title: string) => {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  return `${slugify(title, {
    lower: true,
  })}-${id}`;
};
