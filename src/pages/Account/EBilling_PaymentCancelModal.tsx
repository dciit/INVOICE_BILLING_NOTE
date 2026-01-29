import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "antd";
import "../../css/InvoiceDTModal.css";
import service from "../../service/account.service";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

interface EBilling_PaymentCancelModalProps {
    open: boolean;
    onClose: () => void;
    refreshData: () => void;
    invoiceDetail?: any;
    invoiceDateFrom?: string;
    invoiceDateTo?: string;
    selectedRowKeys?: React.Key[];
    payload?: any;
}

interface InvoiceDetail {
    key: React.Key;
    amtb: number;
    invoiceno: string;
    invoicedate: string;
    rate: string;
    taxid: string;
    totalamount: number;
    totalvat: number;
    vat: number;
    whtax: number;
    vendorcode: string;
    vendorname: string;
    status?: string;
}

const EBilling_PaymentCancelModal: React.FC<
    EBilling_PaymentCancelModalProps
> = ({
    open,
    onClose,
    invoiceDetail,
    refreshData,
    invoiceDateFrom,
    invoiceDateTo,
    selectedRowKeys = [],
    payload,
}) => {
        const auth = useSelector((state: any) => state.reducer.authen);
        const modalRef = useRef<HTMLDivElement>(null);

        const [dataSource, setDataSource] = useState<InvoiceDetail[]>([]);
        const [loading, setLoading] = useState(false);
        const [openConfirmCancel, setOpenConfirmCancel] = useState(false);

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
        };

        useEffect(() => {
            if (open && invoiceDetail) {
                fetchData();
            }
        }, [open, invoiceDetail]);

        const fetchData = async () => {
            try {
                const res = await service.DetailPayment({
                    venderCode: invoiceDetail.vendorcode,
                    status: invoiceDetail.status,
                    invoiceDateFrom,
                    invoiceDateTo,
                });

                const mapped = (res.data || []).map(
                    (item: InvoiceDetail, index: number) => ({
                        ...item,
                        key: index,
                    })
                );

                setDataSource(mapped);
            } catch (error) {
                console.error(error);
                setDataSource([]);
            }
        };

        const handleCancelPayment = async () => {
            try {
                setLoading(true);


                await service.CancelPayment({
                    vendorCode: payload[0]?.vendorCode,
                    status: payload[0]?.status,
                    issuedBy: auth.incharge.trim(),
                    invoiceDateFrom: invoiceDateFrom,
                    invoiceDateTo: invoiceDateTo,
                });

                Swal.fire("สำเร็จ!", "CANCEL PAYMENT เรียบร้อย", "success");

                setOpenConfirmCancel(false);
                onClose();
                refreshData();
            } catch (error: any) {
                console.error(error);
                Swal.fire("ล้มเหลว!", error.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
            } finally {
                setLoading(false);
            }
        };



        const thStyle = { border: "1px solid #333", padding: 8 };
        const tdStyle = { border: "1px solid #333", padding: 8 };

        return (
            <>
                <Modal
                    open={open}
                    onCancel={onClose}
                    footer={null}
                    width={1200}
                >
                    <div ref={modalRef}>
                        <div style={{ textAlign: "center", marginBottom: 20 }}>
                            <div style={{ fontSize: 28, fontWeight: "bold" }}>
                                บริษัท ไดกิ้น คอมเพรสเซอร์ อินดัสทรีส์ จำกัด
                            </div>
                            <div style={{ fontSize: 18 }}>
                                เลขประจำตัวผู้เสียภาษี 0105544013305
                            </div>
                            <div style={{ fontSize: 20, marginTop: 10 }}>
                                รายละเอียดยอดโอนเงิน
                            </div>
                        </div>

                        <p className="text-[16px]">
                            <b>Vendor :</b> {detail.vendorcode} : {detail.vendorname}
                        </p>




                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginTop: 20,
                            }}
                        >
                            <thead>
                                <tr style={{ background: "#f2f2f2", textAlign: "center" }}>
                                    <th style={thStyle}>No</th>
                                    <th style={thStyle}>Invoice No</th>
                                    <th style={thStyle}>Invoice Date</th>
                                    <th style={thStyle}>Amount</th>
                                    <th style={thStyle}>VAT</th>
                                    <th style={thStyle}>Total</th>
                                    <th style={thStyle}>WHT</th>
                                    <th style={thStyle}>Net</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataSource.map((item, idx) => (
                                    <tr key={item.key} style={{ textAlign: "center" }}>
                                        <td style={tdStyle}>{idx + 1}</td>
                                        <td style={tdStyle}>{item.invoiceno}</td>
                                        <td style={tdStyle}>{item.invoicedate}</td>
                                        <td style={tdStyle} className="text-right">
                                            {(item.amtb ?? 0).toLocaleString()}
                                        </td>
                                        <td style={tdStyle} className="text-right">
                                            {(item.vat ?? 0).toLocaleString()}
                                        </td>
                                        <td style={tdStyle} className="text-right">
                                            {(item.totalvat ?? 0).toLocaleString()}
                                        </td>
                                        <td style={tdStyle} className="text-right">
                                            {(item.whtax ?? 0).toLocaleString()}
                                        </td>
                                        <td style={tdStyle} className="text-right">
                                            {(item.totalamount ?? 0).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}

                                {/* ✅ แถวรวมยอด */}
                                {dataSource.length > 0 && (
                                    <tr style={{ fontWeight: "bold", background: "#f9f9f9", textAlign: "center" }}>
                                        <td style={tdStyle} colSpan={3}>
                                            Grand Total
                                        </td>

                                        <td style={tdStyle} className="text-right">
                                            {dataSource
                                                .reduce((sum, item) => sum + (item.amtb ?? 0), 0)
                                                .toLocaleString()}
                                        </td>

                                        <td style={tdStyle} className="text-right">
                                            {dataSource
                                                .reduce((sum, item) => sum + (item.vat ?? 0), 0)
                                                .toLocaleString()}
                                        </td>

                                        <td style={tdStyle} className="text-right">
                                            {dataSource
                                                .reduce((sum, item) => sum + (item.totalvat ?? 0), 0)
                                                .toLocaleString()}
                                        </td>

                                        <td style={tdStyle} className="text-right">
                                            {dataSource
                                                .reduce((sum, item) => sum + (item.whtax ?? 0), 0)
                                                .toLocaleString()}
                                        </td>

                                        <td style={tdStyle} className="text-right">
                                            {dataSource
                                                .reduce((sum, item) => sum + (item.totalamount ?? 0), 0)
                                                .toLocaleString()}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 20,
                        }}
                    >
                        <Button
                            danger
                            type="primary"
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => setOpenConfirmCancel(true)}
                        >
                            Cancel
                        </Button>

                        <Button onClick={onClose}>Close</Button>
                    </div>
                </Modal>

                {/* Confirm Cancel */}
                <Modal
                    open={openConfirmCancel}
                    title="ยืนยันการยกเลิก"
                    onCancel={() => setOpenConfirmCancel(false)}
                    footer={[
                        <Button key="back" onClick={() => setOpenConfirmCancel(false)}>
                            ปิด
                        </Button>,
                        <Button
                            key="confirm"
                            danger
                            type="primary"
                            loading={loading}
                            onClick={handleCancelPayment}
                        >
                            ยืนยัน
                        </Button>,
                    ]}
                >
                    ต้องการยกเลิกรายการที่เลือกใช่หรือไม่?
                </Modal>
            </>
        );
    };

export default EBilling_PaymentCancelModal;
