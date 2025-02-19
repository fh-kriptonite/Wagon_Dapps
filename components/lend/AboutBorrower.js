import ReactMarkdown from 'react-markdown'

export default function AboutBorrower(props) {

  const content = props.content;

  return (
    <div className="space-y-4">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
