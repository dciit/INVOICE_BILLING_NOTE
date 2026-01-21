import React, { useEffect, useState } from "react";
import { Modal, Upload, Button, message } from "antd";
import { LinkOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import svrAttach from "../../service/attachfile.service"

interface EBilling_AttachFileModalProps {
    open: boolean;
    onClose: () => void;
    invoiceDetail?: { documentno: string } | null;
    onSuccess?: () => void;
}

const EBilling_AttachFileModal: React.FC<EBilling_AttachFileModalProps> = ({
    open,
    onClose,
    invoiceDetail,
    onSuccess,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<{ fileName: string; documentNo: string }[]>([]);



    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    const fetchData = async () => {
        try {
            const res = await svrAttach.PostShowFile({ documentno: invoiceDetail?.[0]?.documentno });
            //   const mappedData = res.data.map((item: any, index: number) => ({ ...item, key: index }));
            setAttachedFiles(res.data);
        } catch (error) {
            console.error(error);
        }
    };



    const beforeUpload = (file: File) => {
        if (file.type !== "application/pdf") {
            message.error("You can only upload PDF file!");
            return Upload.LIST_IGNORE;
        }
        setSelectedFile(file);
        return false; // ไม่ auto upload
    };

    const handleAdd = async () => {
        if (!selectedFile) {
            message.error("Please select a PDF file first!");
            return;
        }

        if (!invoiceDetail?.[0]?.documentno) {
            message.error("Document No not found");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("DocumentNo", invoiceDetail?.[0]?.documentno);

            const response = await axios.post(
                "https://localhost:44343/api/Attachfile/PostUploadPDF",
                formData
            );

            message.success(response.data.message);
            onSuccess?.();
            setSelectedFile(null);
            onClose();


            svrAttach.PostShowFile({ documentno: invoiceDetail?.[0]?.documentno }).then((res) => {
                try {
                    setAttachedFiles(res.data);
                } catch (error) {

                }
            })


        } catch (error: any) {
            console.error(error);
            message.error(
                typeof error.response?.data === "string"
                    ? error.response?.data
                    : "Upload failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <span style={{ fontSize: 20, fontWeight: "bold" }}>
                    Attach PDF for Document No:{" "}
                    {invoiceDetail?.[0]?.documentno ?? "N/A"}
                </span>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            destroyOnClose
        >
            <Upload
                beforeUpload={beforeUpload}
                multiple={false}
                maxCount={1}
                accept=".pdf"
                showUploadList={{ showRemoveIcon: true }}
                onRemove={() => setSelectedFile(null)}
            >
                <Button icon={<UploadOutlined />}>Select PDF File</Button>
            </Upload>


            {selectedFile && (
                <div style={{ marginTop: 16, textAlign: "right" }}>
                    <Button type="primary" onClick={handleAdd} loading={loading}>
                        Add
                    </Button>
                </div>
            )}

            <table
                style={{
                    width: "100%",
                    marginTop: 20,
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                }}
            >
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: 8 }}>File Name</th>
                        <th style={{ border: "1px solid #ddd", padding: 8 }}>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {attachedFiles.length === 0 && (
                        <tr>
                            <td colSpan={2} style={{ textAlign: "center", padding: 8 }}>
                                No attached files
                            </td>
                        </tr>
                    )}

                    {attachedFiles.map((item, index) => (
                        <tr key={index}>
                            <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.filE_NAME}</td>
                            <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>
                                <a
                                    href={`https://scm.dci.co.th/E-BILLING/${item.filE_NAME}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontSize: 20, // ขนาด icon
                                        color: "#1890ff",
                                        cursor: "pointer",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <LinkOutlined />
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </Modal>
    );
};

export default EBilling_AttachFileModal;
