interface Issue {
  path: string[],
  message: string
}

export default function simplifyErrors(issues: Issue[]){
  const result = {};
  for (const issue of issues){
    const key = issue.path.join('.') || 'other';
    if (result[key]){
      result[key].push(issue.message);
    } else {
      result[key] = [issue.message]
    }
  }
  return result;
}
