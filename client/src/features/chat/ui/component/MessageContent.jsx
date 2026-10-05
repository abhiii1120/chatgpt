import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const markdownClassName =
  'text-[15px] leading-relaxed text-[#ECECEC] [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_a]:text-[#7EB6FF] [&_a]:underline [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:text-[13px] [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[#0D0D0D] [&_pre]:p-3 [&_pre_code]:bg-transparent [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_th]:border [&_th]:border-[#3A3A3A] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-[#3A3A3A] [&_td]:px-3 [&_td]:py-2'

export default function MessageContent({ message }) {
  if (message.author === 'ai') {
    if (message.isStreaming) {
      return (
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#ECECEC]">
          {message.content}
        </div>
      )
    }

    return (
      <div className={markdownClassName}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
      {message.content}
    </p>
  )
}