import React, { useRef } from "react";
import { Modal, Button } from "antd";
import "../../css/InvoiceDTModal.css";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface InvoiceDetail {
    key: React.Key;
    amtb?: number;
    documentno?: string;
    duedate?: string;
    rate?: string;
    taxid?: string;
    totalamount?: number;
    totalvat?: number;
    vat?: number;
    whtax?: number;
    invoiceno?: string;
    vendorcode?: string;
    vendorname?: string;
    totaL_AMOUNT?: number;
}

interface EBilling_PrintPaymentProps {
    open: boolean;
    onClose: () => void;
    // สามารถรับทั้ง object หรือ array
    invoiceDetail?: InvoiceDetail | InvoiceDetail[];
}

const EBilling_PrintPayment: React.FC<EBilling_PrintPaymentProps> = ({
    open,
    onClose,
    invoiceDetail
}) => {
    const auth = useSelector((state: any) => state.reducer.authen);
    const modalRef = useRef<HTMLDivElement>(null);
    const n = (v?: number) => (v ?? 0).toLocaleString();
    const thStyle = { border: "1px solid #333", padding: "5px" };
    const tdStyle = { border: "1px solid #333", padding: "5px" };

    // แปลงให้ invoiceArray เป็น array เสมอ
    const invoiceArray: InvoiceDetail[] = Array.isArray(invoiceDetail)
        ? invoiceDetail
        : invoiceDetail
            ? [invoiceDetail]
            : [];

    if (invoiceArray.length === 0) return null;

    const exportPDF = async () => {
        if (!modalRef.current) return;

        const canvas = await html2canvas(modalRef.current, {
            scale: 2,
            useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

        pdf.autoPrint();
        window.open(pdf.output("bloburl"), "_blank");
    };

    return (
        <Modal
            title={null}
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>Close</Button>,
                <Button key="print" type="primary" onClick={exportPDF}>Print / Export PDF</Button>
            ]}
            width={1200}
        >
            <div ref={modalRef}>
                {/* ================= Header ================= */}
                <div style={{ marginBottom: 20, textAlign: "center" }}>
                    <div style={{ fontWeight: "bold", fontSize: 28 }}>
                        บริษัท ไดกิ้น คอมเพรสเซอร์ อินดัสทรีส์ จำกัด
                    </div>
                    <div style={{ fontSize: 18 }}>
                        เลขประจำตัวผู้เสียภาษี 0105544013305 สำนักงานใหญ่
                    </div>
                    <div style={{ position: "relative", fontSize: 18 }}>
                        7/202 หมู่ 6 ตำบลมาบยางพร อำเภอปลวกแดง จังหวัดระยอง 21140
                    </div>
                    <div style={{ fontSize: 18 }}>โทร.038-650060</div>
                </div>

                <div style={{ fontSize: 22, textAlign: "center" }}>
                    รายงานสรุปยอดโอนเงินรวม
                </div>

                <table
                    style={{
                        width: "95%",
                        borderCollapse: "collapse",
                        margin: "20px auto",
                        fontSize: 14,
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>
                            <th style={thStyle}>ลำดับที่</th>
                            <th style={thStyle}>รหัส</th>
                            <th style={thStyle}>ชื่อบริษัท</th>
                            <th style={thStyle}>จำนวนเงินรวม ภาษีมูลค่าเพิ่ม</th>
                            <th style={thStyle}>ภาษีหัก ณ ที่จ่าย</th>
                            <th style={thStyle}>จำนวนเงินหลังหัก ภาษีหัก ณ ที่จ่าย</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceArray.map((item, index) => (
                            <tr key={item.key || index} style={{ textAlign: "center" }}>
                                <td style={tdStyle}>{index + 1}</td>
                                <td style={tdStyle}>{item.vendorcode}</td>
                                <td style={tdStyle} className="text-left" >{item.vendorname}</td>
                                <td style={tdStyle} className="text-right">{n(item.totalvat)}</td>
                                <td style={tdStyle} className="text-right">{n(item.whtax)}</td>
                                <td style={tdStyle} className="text-right">{n(item.totaL_AMOUNT)}</td>
                            </tr>
                        ))}

                        {invoiceArray.length > 0 && (
                            <tr style={{ fontWeight: "bold", background: "#f9f9f9" }}>
                                <td style={tdStyle} colSpan={3} className="text-center">ยอดรวมทั้งสิ้น</td>
                                <td style={tdStyle} className="text-right">
                                    {n(invoiceArray.reduce((s, i) => s + (i.totalvat ?? 0), 0))}
                                </td>
                                <td style={tdStyle} className="text-right">
                                    {n(invoiceArray.reduce((s, i) => s + (i.whtax ?? 0), 0))}
                                </td>
                                <td style={tdStyle} className="text-right">
                                    {n(invoiceArray.reduce((s, i) => s + (i.totaL_AMOUNT ?? 0), 0))}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};

export default EBilling_PrintPayment;
