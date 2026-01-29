
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "antd";
import '../../css/InvoiceDTModal.css';
import service from "../../service/account.service";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

interface EBilling_PaymentDetailModalProps {
    open: boolean;
    onClose: () => void;
    refreshData: () => void;
    invoiceDetail?: any; // รองรับค่า null
    invoiceDateFrom?: any;
    invoiceDateTo?: any;
}

interface InvoiceDetail {
    key: React.Key;
    amtb: number;
    documentno: string;
    duedate: string;
    rate: string;
    taxid: string;
    totalamount: number;
    totalvat: number;
    vat: number;
    whtax: number;
    invoiceno: string;
    vendorcode: string;
    vendorname: string;
}

const EBilling_PaymentDetailModal: React.FC<EBilling_PaymentDetailModalProps> = ({
    open,
    onClose,
    invoiceDetail,
    refreshData,
    invoiceDateFrom,
    invoiceDateTo
}) => {
    const auth = useSelector((state: any) => state.reducer.authen);
    const modalRef = useRef<HTMLDivElement>(null);
    const [DataSource, setDataSource] = useState<InvoiceDetail[]>([]);
    const [loading, setLoading] = useState(false);

    // default object ให้ทุก field ป้องกัน undefined
    const detail = {
        vendorcode: invoiceDetail?.vendorcode || "",
        vendorname: invoiceDetail?.vendorname || "",
        addreS1: invoiceDetail?.addreS1 || "",
        addreS2: invoiceDetail?.addreS2 || "",
        zipcode: invoiceDetail?.zipcode || "",
        telno: invoiceDetail?.telno || "",
        faxno: invoiceDetail?.faxno || "",
        documentno: invoiceDetail?.documentno || "",
        status: invoiceDetail?.status || "",
        paymenT_BY: invoiceDetail?.paymenT_BY || "",
        duedate: invoiceDetail?.duedate || "",
        totaL_AMOUNT: invoiceDetail?.totaL_AMOUNT || 0,
        totalvat: invoiceDetail?.totalvat || 0,
        whtax: invoiceDetail?.whtax || 0,
        netpaid: invoiceDetail?.netpaid || 0,
        paymenT_TERMS: invoiceDetail?.paymenT_TERMS || "",
    };

    // Fetch data ทุกครั้งที่ modal เปิด
    useEffect(() => {
        if (open && invoiceDetail) {
            fetchData();
        }
    }, [open, invoiceDetail]);

    const fetchData = async () => {
        if (!invoiceDetail) return;
        try {
            const res = await service.DetailPayment({
                venderCode: invoiceDetail.vendorcode,
                status: invoiceDetail.status,
                invoiceDateFrom: invoiceDateFrom,
                invoiceDateTo: invoiceDateTo
            });
            //  const mappedData = res.data?.map((item: any, index: number) => ({ ...item, key: index })) || [];
            const mappedData = res.data.map((item: InvoiceDetail) => ({ ...item, key: item.vendorcode, }));
            // setDataSource(mapped);
            console.log(mappedData)
            setDataSource(mappedData);
        } catch (error) {
            console.error(error);
            setDataSource([]);
        }
    };

    const exportPDF = async () => {
        if (!modalRef.current) return;
        const element = modalRef.current;
        const button = element.querySelector("button");
        if (button) button.style.display = "none";

        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        const margin = 10;

        pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight - margin);
        pdf.save(`Billing_${detail.documentno}.pdf`);

        if (button) button.style.display = "block";
    };






    const thStyle = { border: "1px solid #333", padding: "8px" };
    const tdStyle = { border: "1px solid #333", padding: "8px" };

    return (
        <Modal
            title={null}
            open={open}   // ต้องเป็น true
            onCancel={onClose}
            footer={null}
            width={1200}
        >
            <div ref={modalRef}>
                <div style={{ marginBottom: 20, textAlign: "center" }}>
                    <div style={{ fontWeight: "bold", fontSize: 28 }}>บริษัท ไดกิ้น คอมเพรสเซอร์ อินดัสทรีส์ จำกัด</div>
                    <div style={{ fontWeight: "normal", fontSize: 18 }}>เลขประจำตัวผู้เสียภาษี 0105544013305 สำนักงานใหญ่</div>
                    <div style={{ position: "relative", fontWeight: "normal", fontSize: 18 }}>
                        7/202 หมู่ 6 ตำบลมาบยางพร อำเภอปลวกแดง จังหวัดระยอง 21140
                    </div>
                    <div style={{ fontWeight: "normal", fontSize: 18 }}>โทร.038-650060</div>
                    <br></br>
                    <div style={{ fontWeight: "normal", fontSize: 20, textAlign: "center" }}>รายละเอียดยอดโอนเงิน</div>
                </div>



                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "3fr 1fr",
                        columnGap: "20px",
                        lineHeight: "1.6",
                        width: "100%",
                        fontSize: 16,
                    }}
                >
                    <div>
                        <p style={{ margin: 0 }}>
                            <span style={{ display: "inline-block", width: 180, fontWeight: "bold" }}>
                                บริษัท / Customer :
                            </span>
                            {detail.vendorcode} : {detail.vendorname}
                        </p>
                        <p style={{ margin: "5px 0 0 0" }}>
                            <span style={{ display: "inline-block", width: 130, fontWeight: "bold" }}>
                                ที่อยู่ / Address :
                            </span>
                            {detail.addreS1}
                        </p>
                        <p style={{ margin: "5px 0 0 0" }}>
                            <span style={{ display: "inline-block", width: 130 }}></span>
                            <span>
                                {detail.addreS2} &nbsp; {detail.zipcode}
                            </span>
                        </p>
                        <p style={{ margin: "5px 0 0 0" }}>
                            <span style={{ display: "inline-block", width: 130 }}></span>
                            <span>
                                Tel. {detail.telno} &nbsp;&nbsp; Fax. {detail.faxno}
                            </span>
                        </p>
                    </div>
                </div>



                <table style={{ width: "95%", borderCollapse: "collapse", margin: "20px auto", fontSize: 14 }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>
                            <th style={thStyle}>ลำดับที่</th>
                            <th style={thStyle}>เลขที่ใบกำกับภาษี</th>
                            <th style={thStyle}>วันที่</th>
                            <th style={thStyle}>จำนวนเงิน ก่อนภาษีมูลค่าเพิ่ม</th>
                            <th style={thStyle}>ภาษีมูลค่าเพิ่ม 7%</th>
                            <th style={thStyle}>จำนวนเงินรวม ภาษีมูลค่าเพิ่ม</th>
                            <th style={thStyle}>อัตราภาษีที่หัก Rate %</th>
                            <th style={thStyle}>ภาษีหัก ณ ที่จ่าย</th>
                            <th style={thStyle}>จำนวนเงินหลังหัก ภาษีหัก ณ ที่จ่าย</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataSource.map((item, index) => (
                            <tr key={index} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                                <td style={tdStyle}>{index + 1}</td>
                                <td style={tdStyle}>{item.invoiceno || "-"}</td>
                                <td style={tdStyle}>{item.invoicedate || "-"}</td>
                                <td style={tdStyle} className="text-right">{(item.amtb || 0).toLocaleString()}</td>
                                <td style={tdStyle} className="text-right">{(item.vat || 0).toLocaleString()}</td>
                                <td style={tdStyle} className="text-right">{(item.totalvat || 0).toLocaleString()}</td>
                                <td style={tdStyle}>{item.rate || "-"}</td>
                                <td style={tdStyle} className="text-right">{(item.whtax || 0).toLocaleString()}</td>
                                <td style={tdStyle} className="text-right">{(item.totalamount || 0).toLocaleString()}</td>
                            </tr>
                        ))}
                        {DataSource.length > 0 && (
                            <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9", textAlign: "center" }}>
                                <td style={tdStyle} colSpan={3}>ยอดรวมทั้งสิ้น</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + (item.amtb || 0), 0).toLocaleString()}</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + (item.vat || 0), 0).toLocaleString()}</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + (item.totalamount || 0), 0).toLocaleString()}</td>
                                <td style={tdStyle}>-</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + (item.whtax || 0), 0).toLocaleString()}</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + (item.totalvat || 0), 0).toLocaleString()}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            <div
                style={{
                    position: "relative",
                    marginTop: 20,
                    height: 48,
                    display: "flex",
                    justifyContent: "space-between", // ⭐ ซ้าย–ขวา
                    alignItems: "center",
                    padding: "0 16px",
                }}
            >
                {/* ซ้ายสุด : Print */}
                <Button
                    key="print"
                    type="primary"
                    onClick={exportPDF}
                >
                    Print / Export PDF
                </Button>

                {/* ขวาสุด : Payment / Cancel */}
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                    }}
                >
                </div>

                {loading && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(255,255,255,0.4)",
                            zIndex: 2,
                        }}
                    />
                )}
            </div>



        </Modal>
    );
};

export default EBilling_PaymentDetailModal;
