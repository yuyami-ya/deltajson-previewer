"use client";

import { useState } from 'react';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
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


function convertDeltaToHtml(delta: Delta): string {
    const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
    return converter.convert();
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

    const [html, setHtml] = useState<string>("");

    const handleConvert = () => {
        try {
            // quillサイトで生成されるデルタ形式JSONに対応
            const deltaBody = Array.isArray(body) ? { ops: body } : body;
            const convertedHtml = convertDeltaToHtml(deltaBody);
            setHtml(convertedHtml);
        } catch (e) {
            console.error(e);
            setHtml(`error: ${e}`);
        }
    };

    return (
        <div className="container">
            <div className="editor">
                <textarea
                    className="textarea"
                    value={JSON.stringify(body, null, 2)}
                    onChange={(e) => setBody(JSON.parse(e.target.value))}
                />
                <div className="html-output" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
            <div className="footer">
                <button className="button" onClick={handleConvert}>Convert</button>
            </div>
        </div>
    );
}
