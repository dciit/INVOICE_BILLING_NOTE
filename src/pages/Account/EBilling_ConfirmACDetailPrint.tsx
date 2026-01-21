//@ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "antd";
import '../../css/InvoiceDTModal.css';
import service from "../../service/confirm.service";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

interface EBilling_ConfirmACDetailPrintProps {
    open: boolean;
    onClose: () => void;
    refreshData: () => void;
    invoiceDetail?: {
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
        addreS1: string;
        addreS2: string;
        faxno: string;
        zipcode: string;
        telno: string;
        invoicedate: string;
        invoiceno: string;
    };
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
}

const EBilling_ConfirmACDetailPrint: React.FC<EBilling_ConfirmACDetailPrintProps> = ({ open, onClose, invoiceDetail, refreshData }) => {
    if (!invoiceDetail) return null;
    const auth = useSelector((state: any) => state.reducer.authen);
    const [DataSource, setDataSource] = useState<InvoiceDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    const fetchData = async () => {
        try {
            const res = await service.PostReportVendorDetail({ documentNo: invoiceDetail[0]?.documentno });
            const mappedData = res.data.map((item: any, index: number) => ({ ...item, key: index }));
            setDataSource(mappedData);
        } catch (error) {
            console.error(error);
        }
    };


    const exportPDF = async () => {
        if (!modalRef.current) return;

        const element = modalRef.current;
        const button = element.querySelector("button"); // เลือกปุ่ม Export PDF

        if (button) button.style.display = "none"; // ซ่อนปุ่ม

        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // margin
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        const margin = 10;

        pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight - margin);
        pdf.save(`ฺBilling_${invoiceDetail.documentno}.pdf`);

        if (button) button.style.display = "block";
    };




    const thStyle = { border: "1px solid #333", padding: "8px" };
    const tdStyle = { border: "1px solid #333", padding: "8px" };

    return (
        <Modal
            title={null}
            open={open}
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
                        <Button
                            type="primary"
                            onClick={exportPDF}
                            style={{
                                position: "absolute",
                                right: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: "#1677ff",
                                borderColor: "#1677ff"
                            }}
                        >
                            Export PDF
                        </Button>
                    </div>


                    <div style={{ fontWeight: "normal", fontSize: 18 }}>โทร.038-650060</div>
                </div>


                <div style={{ fontWeight: "normal", fontSize: 22, textAlign: "center" }}>รายงานสรุปยอดโอนเงิน</div>
                <br />



                <div style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    columnGap: "20px",
                    lineHeight: "1.6",
                    width: "100%"
                }}>
                    <div>
                        <p style={{ margin: 0, fontSize: 16 }}>
                            <span style={{ display: "inline-block", width: 180 }}>
                                <b>บริษัท / Customer :</b>
                            </span>
                            {invoiceDetail[0]?.vendorcode} : {invoiceDetail[0]?.vendorname}
                        </p>
                        <p style={{ margin: "5px 0 0 0" }}>
                            <span style={{ display: "inline-block", width: 130, fontWeight: "bold" }}>
                                ที่อยู่ / Address :
                            </span>
                            {invoiceDetail[0]?.addR1}
                        </p>
                        <p style={{ margin: "5px 0 0 0" }}>
                            <span style={{ display: "inline-block", width: 130 }}></span>
                            <span>
                                {invoiceDetail[0]?.addR2} &nbsp;  {invoiceDetail[0]?.zipcode}
                            </span>
                        </p>
                        <p style={{ margin: "5px 0 0 0" }}>
                            <span style={{ display: "inline-block", width: 130 }}></span>
                            <span>
                                Tel. {invoiceDetail[0]?.telno} &nbsp;&nbsp; Fax. {invoiceDetail[0]?.faxno}
                            </span>
                        </p>
                    </div>


                    <div>
                        <p style={{ margin: 0, fontSize: 16 }}>
                            <span style={{ display: "inline-block", width: 180 }}>
                                <b>วันที่ :</b>
                            </span>
                            {invoiceDetail[0]?.documentdate}
                        </p>
                        <p style={{ margin: 0, fontSize: 16 }}>
                            <span style={{ display: "inline-block", width: 180 }}>
                                <b>เลขที่เอกสาร :</b>
                            </span>
                            {invoiceDetail[0]?.documentno}
                        </p>
                        <p style={{ margin: 0, fontSize: 16 }}>
                            <span style={{ display: "inline-block", width: 200 }}>
                                <b>เงื่อนไขการชำระเงิน :</b>
                            </span>
                            {invoiceDetail[0]?.paymenT_TERMS} Days
                        </p>
                        <p style={{ margin: 0, fontSize: 16 }}>
                            <span style={{ display: "inline-block", width: 200 }}>
                                <b>วันที่ครบกำหนดชำระเงิน :</b>
                            </span>
                            {invoiceDetail[0]?.duedate}
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
                                <td style={tdStyle} className="text-left w-[150px]">{item.invoiceno}</td>
                                <td style={tdStyle}>{item.invoicedate}</td>
                                <td style={tdStyle} className="text-right">{item.amtb.toLocaleString()}</td>
                                <td style={tdStyle} className="text-right">{item.vat.toLocaleString()}</td>
                                <td style={tdStyle} className="text-right">{item.totalvat.toLocaleString()}</td>
                                <td style={tdStyle}>{item.rate}</td>
                                <td style={tdStyle} className="text-right">{item.whtax.toLocaleString()}</td>
                                <td style={tdStyle} className="text-right">{item.totalamount.toLocaleString()}</td>
                            </tr>
                        ))}

                        {DataSource.length > 0 && (
                            <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9", textAlign: "center" }}>
                                <td style={tdStyle} colSpan={3}>ยอดรวมทั้งสิ้น</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + item.amtb, 0).toLocaleString()}</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + item.vat, 0).toLocaleString()}</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + item.totalvat, 0).toLocaleString()}</td>
                                <td style={tdStyle}>-</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + item.whtax, 0).toLocaleString()}</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + item.totalamount, 0).toLocaleString()}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* {
                    JSON.stringify(invoiceDetail)
                } */}

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, padding: "0 20px" }}>
                    <div>
                        <div style={{ fontSize: 16, marginBottom: 8 }}>
                            <b>ผู้รับวางบิล :</b>
                            <span style={{
                                display: "inline-block",
                                borderBottom: "1px dashed #333",
                                width: 250,
                                marginLeft: 5,
                                lineHeight: "24px",
                                paddingBottom: 4
                            }}>{invoiceDetail[0]?.receiveD_BILLERBY}</span>
                        </div>
                        <div style={{ fontSize: 16 }}>
                            <b>วันที่ :</b>
                            <span style={{
                                display: "inline-block",
                                borderBottom: "1px dashed #333",
                                width: 150,
                                marginLeft: 5,
                                lineHeight: "24px",
                                paddingBottom: 4
                            }}>{invoiceDetail[0]?.receiveD_BILLERDATE}</span>
                        </div>
                    </div>

                    <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 16, marginBottom: 8 }}>
                            <b>ผู้วางบิล :</b>
                            <span style={{
                                display: "inline-block",
                                borderBottom: "1px dashed #333",
                                width: 250,
                                marginLeft: 5,
                                lineHeight: "24px",
                                paddingBottom: 4
                            }}>{invoiceDetail[0]?.createby}</span>
                        </div>
                        <div style={{ fontSize: 16 }}>
                            <b>วันที่ :</b>
                            <span style={{
                                display: "inline-block",
                                borderBottom: "1px dashed #333",
                                width: 150,
                                marginLeft: 5,
                                lineHeight: "24px",
                                paddingBottom: 4
                            }}>{invoiceDetail[0]?.createdate}</span>
                        </div>
                    </div>
                </div>
            </div>



            <div
                style={{
                    position: "relative",
                    marginTop: 20,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
                    gap: 12, // ระยะห่างระหว่างปุ่ม
                }}
            >

                {auth.role === "rol_accountant" && invoiceDetail.rejecT_BY === "" && (
                    <Button
                        danger
                        size="large"
                        onClick={RejectBeforeConfirmbilling}
                        disabled={loading}
                        style={{
                            backgroundColor: "red",
                            borderColor: "red",
                            color: "white",
                            height: 38,
                            fontSize: 14,
                            padding: "0 36px",
                            fontWeight: "bold",
                            pointerEvents: loading ? "none" : "auto",
                        }}
                    >
                        Reject
                    </Button>
                )}


                {auth.role === "rol_accountant" && invoiceDetail.receiveD_BILLERBY === "" && invoiceDetail.rejecT_BY === "" && (
                    <Button
                        type="primary"
                        size="large"
                        onClick={confirmbilling}
                        disabled={loading}
                        style={{
                            backgroundColor: "#52c41a",
                            borderColor: "#52c41a",
                            height: 38,
                            fontSize: 14,
                            padding: "0 36px",
                            fontWeight: "bold",
                            pointerEvents: loading ? "none" : "auto",
                            marginLeft: "auto",
                        }}
                    >
                        {loading ? "กำลังประมวลผล..." : "รับวางบิล"}
                    </Button>
                )}

                {/* overlay ตอน loading */}
                {loading && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(255,255,255,0.5)",
                            zIndex: 2,
                        }}
                    />
                )}
            </div>



        </Modal>
    );
};

export default EBilling_ConfirmACDetailPrint;
