//@ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "antd";
import '../../css/InvoiceDTModal.css';
import service from "../../service/confirm.service";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

interface EBilling_DetailModalVendorProps {
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

const EBilling_DetailModalAC: React.FC<EBilling_DetailModalVendorProps> = ({ open, onClose, invoiceDetail, refreshData }) => {
    if (!invoiceDetail) return null;
    const auth = useSelector((state: any) => state.reducer.authen);
    const [DataSource, setDataSource] = useState<InvoiceDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchData();
    }, [open]);



    const fetchData = async () => {
        try {
            const res = await service.PostReportACAndVendorDetail({ venderCode: invoiceDetail.vendorcode, status: invoiceDetail.status, role: auth.role });
            const mappedData = res.data.map((item: any, index: number) => ({ ...item, key: index }));
            setDataSource(mappedData);


        } catch (error) {
            console.error(error);
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
        pdf.save(`ฺBilling_${invoiceDetail.documentno}.pdf`);

        if (button) button.style.display = "block";
    };

    console.log(invoiceDetail)

    const payment = async () => {
        try {
            setLoading(true);

            const invoiceNoList = DataSource.map(item => `'${item.invoiceno}'`).join(",");
            const invoiceNoForIn = `(${invoiceNoList})`;

            await service.PostPayment({
                vendorCode: invoiceDetail.vendorcode,
                invoiceNo: invoiceNoForIn,
                payBy: auth.incharge.trim()
            });


            Swal.fire(
                'สำเร็จ!',
                'บันทึกข้อมูลรับวางบิลเรียบร้อยแล้ว',
                'success'
            );

            refreshData();

        } catch (error) {
            console.error(error);
            Swal.fire(
                'ล้มเหลว!',
                error.message || 'ไม่สามารถบันทึกข้อมูลได้',
                'error'
            );
        } finally {
            setLoading(false);
        }



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
                <div style={{ fontWeight: "normal", fontSize: 22, textAlign: "center" }}>รายงานสรุปยอดโอนเงิน</div>
                <br />


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
                        {/* ชื่อบริษัท */}
                        <p style={{ margin: 0 }}>
                            <span style={{ display: "inline-block", width: 180, fontWeight: "bold" }}>
                                บริษัท / Customer :
                            </span>
                            {invoiceDetail.vendorname}
                        </p>


                        <p style={{ margin: "5px 0 0 0" }}>
                            <span style={{ display: "inline-block", width: 130, fontWeight: "bold" }}>
                                ที่อยู่ / Address :
                            </span>
                            {invoiceDetail.addreS1}
                        </p>

                        <p style={{ margin: "5px 0 0 0" }}>
                            <span style={{ display: "inline-block", width: 130 }}></span>
                            <span>
                                {invoiceDetail.addreS2} &nbsp;  {invoiceDetail.zipcode}
                            </span>
                        </p>


                        <p style={{ margin: "5px 0 0 0" }}>
                            <span style={{ display: "inline-block", width: 130 }}></span>
                            <span>
                                Tel. {invoiceDetail.telno} &nbsp;&nbsp; Fax. {invoiceDetail.faxno}
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
                                <td style={tdStyle} className="text-left w-[150px]">{item.invoiceno}</td>
                                <td style={tdStyle}>{item.duedate}</td>
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
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + item.totalamount, 0).toLocaleString()}</td>
                                <td style={tdStyle}>-</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + item.whtax, 0).toLocaleString()}</td>
                                <td style={tdStyle} className="underline text-right">{DataSource.reduce((sum, item) => sum + item.totalvat, 0).toLocaleString()}</td>
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
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "0 16px"
                }}
            >
                {auth?.role?.toLowerCase() === "rol_accountant" && invoiceDetail.paymenT_BY === "" && (
                    <Button
                        type="primary"
                        size="large"
                        onClick={payment}
                        loading={loading}
                        style={{
                            backgroundColor: "#52c41a",
                            borderColor: "#52c41a",
                            height: 38,
                            fontSize: 14,
                            padding: "0 36px",
                            fontWeight: "bold"
                        }}
                    >
                        Payment
                    </Button>
                )}

                {loading && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(255,255,255,0.5)",
                            zIndex: 2
                        }}
                    />
                )}
            </div>


        </Modal>
    );
};

export default EBilling_DetailModalAC;
