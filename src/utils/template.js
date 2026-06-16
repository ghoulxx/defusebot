function formatTemplate(template, context = {}) {
  if (!template) return '';
  return template.replace(/\{(.*?)\}/g, (_, key) => {
    const path = key.split('.');
    let value = context;
    for (const part of path) {
      if (value === undefined || value === null) return '';
      value = value[part];
    }
    return typeof value === 'string' || typeof value === 'number' ? value : '';
  });
}

module.exports = { formatTemplate };
