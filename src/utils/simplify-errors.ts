interface Issue {
  path: string[],
  message: string
}

export default function simplifyErrors(issues: Issue[]){
  let result: any = {};
  for (const issue of issues){
    const key = issue.path.join('.') || 'other';
    if(result && Array.isArray(result[key as keyof typeof result])) {
      result[key as keyof typeof result].push(issue.message)
    } else {
      result = Object.assign({}, { [key]: [issue.message] })
    }
  }
  return result;
}
