"use client";

import { useState } from 'react';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import '../styles/markdownStyles.css';
import Head from 'next/head';

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
                "insert": "Child List 2"
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
                "insert": "Thank you"
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
        <>
            <Head>
                <title>Delta Json Previewer</title>
            </Head>
            <div className="flex flex-col h-screen">
                <h1 className="text-2xl font-bold p-4">Delta Json Previewer</h1>
                <div className="flex-1 flex space-x-4 p-4 overflow-auto">
                    <div className="flex flex-col space-y-1 w-1/2">
                        <label htmlFor="deltaJsonInput">DeltaJson入力欄</label>
                        <textarea
                            id="deltaJsonInput"
                            className="h-[calc(100vh-100px)] w-full p-2 border overflow-auto"
                            value={JSON.stringify(body, null, 2)}
                            onChange={(e) => setBody(JSON.parse(e.target.value))}
                        />
                    </div>
                    <div className="flex flex-col space-y-1 w-1/2">
                        <label htmlFor="htmlPreview">プレビュー</label>
                        <div
                            id="htmlPreview"
                            className="html-output w-full h-[calc(100vh-100px)] p-2 border overflow-auto"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    </div>
                </div>
                <div className="footer p-4 border-t">
                    <button className="button bg-blue-500 text-white p-2 rounded" onClick={handleConvert}>Convert</button>
                </div>
            </div>
        </>
    );
}
