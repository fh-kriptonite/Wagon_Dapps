import ReactMarkdown from 'react-markdown'

export default function AboutBorrower(props) {

  const poolJson = props.poolJson;

  return (
    <div className="space-y-4">
      <ReactMarkdown>{poolJson?.properties.borrower}</ReactMarkdown>
    </div>
  )
}
