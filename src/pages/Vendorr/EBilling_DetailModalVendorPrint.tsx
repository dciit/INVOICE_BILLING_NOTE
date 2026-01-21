//@ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import { Modal } from "antd";
import "../../css/InvoiceDTModal.css";
import service from "../../service/confirm.service";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ===================== Types ===================== */
interface EBilling_DetailModalVendorPrintProps {
    open: boolean;
    onClose: () => void;
    invoiceDetail?: {
        address: string;
        billerby: string;
        billerdate: string;
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

interface InvoiceDetailRow {
    key: React.Key;
    invoiceno?: string;
    invoicedate?: string;
    totalvat?: number;
    whtax?: number;
    totalamount?: number;
}

/* ===================== Component ===================== */
const EBilling_DetailModalVendorPrint: React.FC<EBilling_DetailModalVendorPrintProps> = ({ open, onClose, invoiceDetail }) => {
    const auth = useSelector((state: any) => state.reducer.authen);
    const modalRef = useRef<HTMLDivElement>(null);
    const [dataSource, setDataSource] = useState<InvoiceDetailRow[]>([]);
    const n = (v?: number) => (v ?? 0).toLocaleString();
    const thStyle = {
        padding: "6px",
        textAlign: "center",
        verticalAlign: "middle",
        lineHeight: "1.4",
        borderBottom: "0.75px solid #000",
        borderRight: "0.75px solid #000",
    };

    const tdStyle = {
        padding: "6px",
        verticalAlign: "middle",
        lineHeight: "1.4",
        borderBottom: "0.75px solid #000",
        borderRight: "0.75px solid #000",
    };



    useEffect(() => {
        if (open && invoiceDetail) {
            fetchData();
        }
    }, [open, invoiceDetail]);

    const fetchData = async () => {
        try {
            if (!invoiceDetail) return;

            const res = await service.PostReportVendorDetailPrint({
                documentNo: invoiceDetail[0]?.documentno,
            });

            const mapped = (res.data || []).map((item: any, index: number) => ({
                ...item,
                key: index,
            }));

            setDataSource(mapped);
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        if (open && dataSource.length > 0) {
            setTimeout(exportPDF, 600);
        }
    }, [open, dataSource]);

    const margin = 10;


    const exportPDF = async () => {
        if (!modalRef.current) return;

        const canvas = await html2canvas(modalRef.current, {
            scale: 2,
            useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = margin;

        // หน้าแรก
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // หน้าถัดไป (สูตรที่ถูกต้อง)
        while (heightLeft > 0) {
            position = heightLeft - imgHeight + margin;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

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
            <div ref={modalRef} style={{ paddingBottom: 80 }}>
                {/* ================= Header ================= */}
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 22 }}>
                        DAIKIN COMPRESSOR INDUSTRIES LTD. - E-Billing Confirmation Summary
                    </div>

                    <br /><br />

                    <div style={{ fontSize: 18, marginBottom: 5 }}>
                        Date & Time of Issued : {invoiceDetail[0]?.billerdate}
                    </div>
                    <div style={{ fontSize: 18, marginBottom: 5 }}>
                        Billing Receipt Number : {invoiceDetail[0]?.documentno}
                    </div>

                    <br />

                    <div style={{ fontSize: 18, marginBottom: 5 }}>Vendor Information</div>
                    <div style={{ fontSize: 18, marginBottom: 5 }}>Company Name : {invoiceDetail[0]?.vendorname}</div>
                    <div style={{ fontSize: 18, marginBottom: 5 }}>Address : {invoiceDetail[0]?.addreS1}{invoiceDetail[0]?.addreS2}</div>
                    <div style={{ fontSize: 18, marginBottom: 5 }}>Tax ID : {invoiceDetail[0]?.taxid}</div>
                    <div style={{ fontSize: 18, marginBottom: 5 }}>Credit Term : {invoiceDetail[0]?.paymenT_TERMS} Days (End of Following Month)</div>
                    <div style={{ fontSize: 18, marginBottom: 5 }}>Due Date : {invoiceDetail[0]?.duedate}</div>
                </div>

                <div style={{ fontSize: 18, marginBottom: 15 }}>Invoice Details</div>

                <table
                    style={{
                        width: "95%",
                        borderCollapse: "collapse",
                        margin: "0 auto",
                        fontSize: 14,
                        border: "0.75px solid #000"
                    }}
                >
                    <thead>
                        <tr style={{ height: 40 }}>
                            <th style={thStyle}>Item</th>
                            <th style={thStyle}>Invoice No</th>
                            <th style={thStyle}>Invoice Date</th>
                            <th style={thStyle}>Gross Amount (THB)</th>
                            <th style={thStyle}>Withholding Tax</th>
                            <th style={{ ...thStyle, borderRight: "none" }}>
                                Net Payment (THB)
                            </th>
                        </tr>
                    </thead>


                    <tbody>
                        {dataSource.map((item, index) => (
                            <tr key={item.key} style={{ textAlign: "center" }}>
                                <td style={tdStyle}>{index + 1}</td>
                                <td style={tdStyle}>{item.invoiceno}</td>
                                <td style={tdStyle}>{item.invoicedate}</td>
                                <td style={tdStyle} className="text-right">
                                    {n(item.totalvat)}
                                </td>
                                <td style={tdStyle} className="text-right">
                                    {n(item.whtax)}
                                </td>
                                <td style={tdStyle} className="text-right">
                                    {n(item.totalamount)}
                                </td>
                            </tr>
                        ))}

                        {dataSource.length > 0 && (
                            <tr style={{ fontWeight: "bold", textAlign: "center" }}>
                                <td style={{ ...tdStyle, borderBottom: "none" }} colSpan={3}>
                                    TOTAL
                                </td>
                                <td style={{ ...tdStyle, borderBottom: "none", textAlign: "right" }}>
                                    {n(dataSource.reduce((s, i) => s + (i.totalvat ?? 0), 0))}
                                </td>
                                <td style={{ ...tdStyle, borderBottom: "none", textAlign: "right" }}>
                                    {n(dataSource.reduce((s, i) => s + (i.whtax ?? 0), 0))}
                                </td>
                                <td
                                    style={{
                                        ...tdStyle,
                                        borderBottom: "none",
                                        borderRight: "none",
                                        textAlign: "right",
                                    }}
                                >
                                    {n(
                                        dataSource.reduce(
                                            (s, i) => s + (i.totalamount ?? 0),
                                            0
                                        )
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>


                <div style={{ fontSize: 18, marginBottom: 5, marginTop: 20 }}>Status and Certification</div>
                <div style={{ fontSize: 18, marginBottom: 5 }}>Current Status : Received & Awaiting Review</div>
                <div style={{ fontSize: 18, marginBottom: 50 }}>Recorded By : Automatic System (Confirm By {invoiceDetail[0]?.vendorname})</div>
                <div style={{ fontSize: 18, marginBottom: 5 }}>Note : This document is system-generated and does not require signature</div>
                <div style={{ fontSize: 18, marginBottom: 5 }}>Please use this document as proof of submission for payment tracking purposes.</div>
            </div>
        </Modal>
    );
};

export default EBilling_DetailModalVendorPrint;
