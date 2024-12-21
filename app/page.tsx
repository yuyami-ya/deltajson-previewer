"use client";

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import 'github-markdown-css/github-markdown.css';
import '../styles/markdownStyles.css';
import '../styles.css';

interface Mention {
    id: string;
    value: string;
}

interface Insert {
    mention?: Mention;
    styled_mention?: Mention;
    text?: string;
    link?: string;
}

interface Attribute {
    list?: string;
    indent?: number;
    link?: string;
    blockquote?: boolean;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    color?: string;
    background?: string;
    code_block?: boolean;
    header?: number;
    image?: string;
}

interface OpsItem {
    insert: Insert | string;
    attributes?: Attribute;
}

interface Delta {
    ops: OpsItem[];
}

function convertToMarkdown(delta: Delta): string {
    const markdownLines: string[] = [];

    delta.ops.forEach((op: OpsItem) => {
        try {
            if (typeof op.insert === 'object') {
                if (op.insert.mention) {
                    markdownLines.push(`@${op.insert.mention.value}`);
                } else {
                    markdownLines.push(JSON.stringify(op));
                }
                return;
            }

            const text = op.insert.trim();
            const attributes = op.attributes || {};

            if (attributes.header) {
                const level = attributes.header;
                markdownLines.push(`${'#'.repeat(level)} ${text}`);
            } else if (attributes.bold) {
                markdownLines.push(`**${text}**`);
            } else if (attributes.italic) {
                markdownLines.push(`*${text}*`);
            } else if (attributes.underline) {
                markdownLines.push(`<u>${text}</u>`);
            } else if (attributes.link) {
                markdownLines.push(`[${text}](${attributes.link})`);
            } else if (attributes.code_block) {
                markdownLines.push(`\`\`\`\n${text}\n\`\`\``);
            } else if (attributes.blockquote) {
                markdownLines.push(`> ${text}`);
            } else if (attributes.image) {
                markdownLines.push(`![Image](${attributes.image})`);
            } else if (attributes.list) {
                const listType = attributes.list;
                const indent = attributes.indent || 0;
                const spaces = ' '.repeat(indent * 4);
                if (listType === 'bullet') {
                    markdownLines[-1] = `${spaces}- ${markdownLines[-1]}`;
                } else if (listType === 'ordered') {
                    markdownLines[-1] = `${spaces}1. ${markdownLines[-1]}`;
                }
            } else {
                markdownLines.push(text);
            }
        } catch (e) {
            console.error(e);
            markdownLines.push(JSON.stringify(op));
        }
    });

    return markdownLines.join('\n');
}

export default function Home() {
    const [body, setBody] = useState<Delta>({
        "ops": [
            {
                "insert": "This is a sample"
            },
            {
                "insert": "\n"
            },
            {
                "insert": "Parent List 1"
            },
            {
                "insert": "\n",
                "attributes": {
                    "list": "bullet"
                }
            },
            {
                "insert": "Parent List 2 When you insert a link in a list, a link is added to the child element."
            },
            {
                "insert": "\n",
                "attributes": {
                    "list": "bullet"
                }
            },
            {
                "insert": "https://sample.com/1",
                "attributes": {
                    "link": "https://sample.com/1"
                }
            },
            {
                "insert": "\n",
                "attributes": {
                    "list": "bullet",
                    "indent": 1
                }
            },
            {
                "insert": "Parent List 3"
            },
            {
                "insert": "\n",
                "attributes": {
                    "list": "bullet"
                }
            },
            {
                "insert": "Child List 1"
            },
            {
                "insert": "\n",
                "attributes": {
                    "list": "bullet",
                    "indent": 1
                }
            },
            {
                "insert": "Child List 2 Underline style will be reset"
            },
            {
                "insert": "\n",
                "attributes": {
                    "list": "bullet",
                    "indent": 1
                }
            },
            {
                "insert": "Child List 3"
            },
            {
                "insert": "\n",
                "attributes": {
                    "list": "bullet",
                    "indent": 1
                }
            },
            {
                "insert": ""
            },
            {
                "insert": "\n"
            },
            {
                "insert": "First Number List"
            },
            {
                "insert": "\n",
                "attributes": {
                    "list": "ordered"
                }
            },
            {
                "insert": "Second Number List"
            },
            {
                "insert": "\n",
                "attributes": {
                    "list": "ordered"
                }
            },
            {
                "insert": "Number list child elements"
            },
            {
                "insert": "\n",
                "attributes": {
                    "list": "ordered",
                    "indent": 1
                }
            },
            {
                "insert": "Bold will also be reset"
            },
            {
                "insert": "\n"
            }
        ]
    });

    const [markdown, setMarkdown] = useState<string>("empty");

    const handleConvertToMarkdown = () => {
        try {
            const convertedMarkdown = convertToMarkdown(body);
            setMarkdown(convertedMarkdown);
        } catch (e) {
            console.error(e);
            setMarkdown(`error: ${e}`);
        }
    };

    const convertToMarkdown = () => {
        const convertedMarkdown = convertToMarkdown(body);
        setMarkdown(convertedMarkdown);
    };


    return (
        <div className="container">
            <div className="editor">
                <textarea
                    className="textarea"
                    value={JSON.stringify(body, null, 2)}
                    onChange={(e) => setBody(JSON.parse(e.target.value))}
                />
                <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm, breaks]}>{markdown}</ReactMarkdown>
                </div>
            </div>
            <div className="footer">
                <button className="button" onClick={handleConvertToMarkdown}>Convert to Markdown</button>
                <pre>{markdown}</pre>
            </div>
        </div>
    );
}
