//@ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "antd";
import "../../css/InvoiceDTModal.css";
import service from "../../service/confirm.service";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface EBilling_DetailModalACPrintProps {
    open: boolean;
    onClose: () => void;
    invoiceDetail?: {
        address: string;
        billerby: string;
        billerdate: string;
        date: string;
        documentno: string;
        duedate: string;
        netpaid: number;
        paymenT_TERMS: string;
        receiveD_BILLERBY: string;
        receiveD_BILLERDATE: string;
        taxid: string;
        totaL_AMOUNT: number;
        vendorcode: string;
        vendorname: string;
        whtax: number;
        status: string;
        invoicedate: string;
        invoiceno: string;
    };
}

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
}

const EBilling_DetailModalACPrint: React.FC<EBilling_DetailModalACPrintProps> = ({ open, onClose, invoiceDetail }) => {
    const auth = useSelector((state: any) => state.reducer.authen);
    const modalRef = useRef<HTMLDivElement>(null);
    const n = (v?: number) => (v ?? 0).toLocaleString();
    const thStyle = { border: "1px solid #333", padding: "5px" };
    const tdStyle = { border: "1px solid #333", padding: "5px" };

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                exportPDF();
            }, 500);
        }
    }, [open]);

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



    if (!invoiceDetail) return null;


    return (
        <Modal
            title={null}
            open={open}
            onCancel={onClose}
            footer={null}
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
                            <th style={thStyle} className="w-[60px]">ลำดับที่</th>
                            <th style={thStyle} className="w-[100px]">รหัส</th>
                            <th style={thStyle} className="w-[400px]">ชื่อบริษัท</th>
                            <th style={thStyle} className="w-[150px]">จำนวนเงินรวม ภาษีมูลค่าเพิ่ม</th>
                            <th style={thStyle} className="w-[150px]">ภาษีหัก ณ ที่จ่าย</th>
                            <th style={thStyle} className="w-[150px]">จำนวนเงินหลังหัก ภาษีหัก ณ ที่จ่าย</th>
                        </tr>
                    </thead>

                    <tbody>
                        {invoiceDetail.map((item, index) => (
                            <tr key={item.key} style={{ textAlign: "center" }}>
                                <td style={tdStyle}>{index + 1}</td>
                                <td style={tdStyle} className="text-left">{item.vendorcode}</td>
                                <td style={tdStyle} className="text-left">{item.vendorname}</td>
                                <td style={tdStyle} className="text-right">
                                    {n(item.totalvat)}
                                </td>
                                <td style={tdStyle} className="text-right">
                                    {n(item.whtax)}
                                </td>
                                <td style={tdStyle} className="text-right">
                                    {n(item.totaL_AMOUNT)}
                                </td>
                            </tr>
                        ))}

                        {invoiceDetail.length > 0 && (
                            <tr style={{ fontWeight: "bold", background: "#f9f9f9" }}>
                                <td style={tdStyle} colSpan={3} className="text-center">ยอดรวมทั้งสิ้น</td>


                                <td style={tdStyle} className="text-right">
                                    {n(invoiceDetail.reduce((s, i) => s + (i.totalvat ?? 0), 0))}
                                </td>


                                <td style={tdStyle} className="text-right">
                                    {n(invoiceDetail.reduce((s, i) => s + (i.whtax ?? 0), 0))}
                                </td>


                                <td style={tdStyle} className="text-right">
                                    {n(invoiceDetail.reduce((s, i) => s + (i.totaL_AMOUNT ?? 0), 0))}
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </Modal>
    );
};

export default EBilling_DetailModalACPrint;
