
import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Divider, Table, Checkbox, Select } from "antd";
import { FormOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import service from "../../service/confirm.service";
import { useSelector } from "react-redux";
import "../../css/InvoiceConfirm.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export type MData = {
    no: number;
    key: React.Key;
    amtb?: number;
    currency?: string;
    duedate?: string;
    invoiceDate?: string;
    invoiceNo?: string;
    paymentTerms?: string;
    totalAmount?: string;
    vat?: string;
    venderCode?: string;
    vendorName?: string;
    whTax?: string;
    whTaxRate?: string;
    taxID?: string;
    vatIn?: string;
};

export default function EBilling_confirm() {
    const auth = useSelector((state: any) => state.reducer.authen);
    const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().startOf("month"));
    const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<MData[]>([]);
    const [loading, setLoading] = useState(false);
    const [InvoiceNo, setInvoiceNo] = useState("");
    const [incharge, setIncharge] = useState("");
    const visibleData = dataSource;
    const [confirmStatus, setConfirmStatus] = useState<"correct" | "not_correct" | null>(null);
    const [invoiceCheckList, setinvoiceCheckList] = useState<any[]>([]);
    const [remark, setRemark] = useState("");

    useEffect(() => { }, [auth.username]);


    useEffect(() => {
        service.getINVCHECK().then((res) => {
            try {
                setinvoiceCheckList(res.data);
            } catch (error) {
                console.error(error);
            }
        });
    }, []);

    const toggleSelectAll = (checked: boolean) => {
        const keys = visibleData.map(item => item.key);
        setSelectedKeys(checked ? keys : []);
    };

    const onSearch = async () => {
        if (!fromDate || !toDate) {
            Swal.fire({
                icon: "warning",
                title: "Please select Document dates.",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            setLoading(true);
            const res = await service.PostLoadInvoiceRequet({
                venderCode: auth.vendercode,
                invoiceNo: InvoiceNo,
                invoiceDateFrom: fromDate.format("YYYYMMDD"),
                invoiceDateTo: toDate.format("YYYYMMDD")
            });



            const filteredData = res.data
                .map((item: any, index: number) => ({ ...item, key: index, whTaxRate: null }))
                .filter((item: any) => {
                    const date = dayjs(item.invoiceDate, "DD/MM/YYYY");
                    return date.isBetween(fromDate, toDate, "day", "[]");
                });

            setDataSource(filteredData);
            setSelectedKeys([]);

            console.log("Search", filteredData)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    // ฟังก์ชันคำนวณ W/H TAX
    const calcWhTax = (record: MData) => {
        const amtb = Number(record.amtb ?? 0);
        const vat = Number(record.vatIn ?? 0);
        let whTax = 0;

        if (record.whTaxRate && record.whTaxRate !== "ไม่หัก") {
            const rate = parseFloat(record.whTaxRate.replace("%", ""));
            whTax = (amtb + vat) * (rate / 100);
        }
        return whTax;
    };

    const onConfirm = async () => {
        if (selectedKeys.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Please select at least one invoice.",
                confirmButtonText: "OK",
            });
            return;
        }


        if (incharge === "") {
            Swal.fire({
                icon: "warning",
                title: "Please input incharge.",
                confirmButtonText: "OK",
            });
            return;
        }

        if (!confirmStatus) {
            Swal.fire({
                icon: "warning",
                title: "Please confirm invoice status.",
            });
            return;
        }

        if (confirmStatus === "INVCHECK02" && !remark.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Please input remark.",
            });
            return;
        }


        try {
            const nbrRes = await service.getNbr();
            const running = nbrRes.data[0].running;
            const selectedItems = dataSource.filter(item => selectedKeys.includes(item.key));

            for (let i = 0; i < selectedItems.length; i++) {
                const item = selectedItems[i];

                const amtb = Number(item.amtb ?? 0);
                const vat = Number(item.vat ?? 0);
                const whTax = calcWhTax(item);
                const totalVat = amtb + vat;
                const totalAmount = totalVat - whTax;
                const netPaid = totalAmount - whTax;
                const dueDate = item.duedate ? dayjs(item.duedate, "DD/MM/YYYY") : null;
                const invoiceDate = item.invoiceDate ? dayjs(item.invoiceDate, "DD/MM/YYYY") : null;



                const payload = {
                    DOCUMENTNO: running,
                    DOCUMENTDATE: dayjs().format("YYYY-MM-DD"),
                    PAYMENT_TERMS: item.paymentTerms?.trim(),
                    DUEDATE: dueDate && dueDate.isValid() ? dueDate.format("YYYY-MM-DD") : null,
                    VENDORCODE: item.venderCode?.trim(),
                    BILLERBY: incharge.trim(),
                    CREATEBY: incharge.trim(),
                    INVOICENO: item.invoiceNo?.trim(),
                    INVOICEDATE: invoiceDate && invoiceDate.isValid() ? invoiceDate.format("YYYY-MM-DD") : null,
                    TAXID: item.taxID?.trim(),
                    CURRENCY: item.currency?.trim(),
                    AMTB: parseFloat(amtb.toFixed(2)),
                    VAT: parseFloat(vat.toFixed(2)),
                    TOTALVAT: parseFloat(totalVat.toFixed(2)),
                    RATE: item.whTaxRate ?? "ไม่หัก",
                    WHTAX: parseFloat(whTax.toFixed(2)),
                    NETPAID: parseFloat(netPaid.toFixed(2)),
                    BEFORVATAMOUNT: parseFloat(amtb.toFixed(2)),
                    TOTAL_AMOUNT: parseFloat(totalAmount.toFixed(2)),
                    STATUS: "WAITING_DCI",
                    ACTYPE: item.actype,
                    IS_INVOICECORRECT: confirmStatus,
                    INVOICE_VERIFICATION_REMARK: remark,
                };

                // console.log("payload", payload)

                await service.PostCreateInvoice(payload);
            }

            Swal.fire({
                icon: "success",
                title: "Invoice created successfully!",
                confirmButtonText: "OK",
            });
            setSelectedKeys([]);
        } catch (err) {
            console.error("Error", err);
            Swal.fire({
                icon: "error",
                title: "Cannot create invoice!",
                text: "Please try again later.",
            });
        }
    };


    const onNotConfirm = async () => {
        if (selectedKeys.length === 0) {
            Swal.fire({ icon: "warning", title: "Please select at least one invoice.", confirmButtonText: "OK" });
            return;
        }

        if (incharge === "") {
            Swal.fire({ icon: "warning", title: "Please input incharge.", confirmButtonText: "OK" });
            return;
        }

        if (!confirmStatus) {
            Swal.fire({ icon: "warning", title: "Please confirm invoice status." });
            return;
        }

        if (confirmStatus === "INVCHECK02" && !remark.trim()) {
            Swal.fire({ icon: "warning", title: "Please input remark." });
            return;
        }

        try {
            const nbrRes = await service.getNbr();
            const running = nbrRes.data[0].running;

            const selectedItems = dataSource.filter(item => selectedKeys.includes(item.key));

            const payloadList = selectedItems.map((item) => {
                const amtb = Number(item.amtb ?? 0);
                const vat = Number(item.vat ?? 0);
                const whTax = calcWhTax(item);
                const totalVat = amtb + vat;
                const totalAmount = totalVat - whTax;
                const netPaid = totalAmount - whTax;
                const dueDate = item.duedate ? dayjs(item.duedate, "DD/MM/YYYY") : null;
                const invoiceDate = item.invoiceDate ? dayjs(item.invoiceDate, "DD/MM/YYYY") : null;

                return {
                    DOCUMENTNO: running,
                    DOCUMENTDATE: dayjs().format("YYYY-MM-DD"),
                    PAYMENT_TERMS: item.paymentTerms?.trim(),
                    DUEDATE: dueDate && dueDate.isValid() ? dueDate.format("YYYY-MM-DD") : null,
                    VENDORCODE: item.venderCode?.trim(),
                    BILLERBY: incharge.trim(),
                    CREATEBY: incharge.trim(),
                    INVOICENO: item.invoiceNo?.trim(),
                    INVOICEDATE: invoiceDate && invoiceDate.isValid() ? invoiceDate.format("YYYY-MM-DD") : null,
                    TAXID: item.taxID?.trim(),
                    CURRENCY: item.currency?.trim(),
                    AMTB: parseFloat(amtb.toFixed(2)),
                    VAT: parseFloat(vat.toFixed(2)),
                    TOTALVAT: parseFloat(totalVat.toFixed(2)),
                    RATE: item.whTaxRate ?? "ไม่หัก",
                    WHTAX: parseFloat(whTax.toFixed(2)),
                    NETPAID: parseFloat(netPaid.toFixed(2)),
                    BEFORVATAMOUNT: parseFloat(amtb.toFixed(2)),
                    TOTAL_AMOUNT: parseFloat(totalAmount.toFixed(2)),
                    STATUS: "VENDOR_REJECT",
                    ACTYPE: item.actype,
                    IS_INVOICECORRECT: confirmStatus,
                    INVOICE_VERIFICATION_REMARK: remark,
                };
            });

            // 🔥 ยิงครั้งเดียว
            await service.PostInvoiceincorrect(payloadList);

            Swal.fire({
                icon: "success",
                title: "ส่งอีเมลแจ้งปัญหา เรียบร้อยแล้ว! กรุณารอการติดต่อกลับ",
                confirmButtonText: "OK",
            });

            setSelectedKeys([]);
        } catch (err) {
            console.error("Error", err);
            Swal.fire({
                icon: "error",
                title: "Cannot create invoice!",
                text: "Please try again later.",
            });
        }
    };



    const columns = [
        { title: "No", dataIndex: "no", width: 60, align: "center" },
        // { title: "DOCUMENT NO", dataIndex: "documentNo", width: 150, align: "center" },
        { title: "INVOICE NO", dataIndex: "invoiceNo", width: 180, align: "center" },
        { title: "INVOICE DATE", dataIndex: "invoiceDate", width: 120, align: "center" },
        {
            title: "VENDER NAME",
            dataIndex: "vendorName",
            width: 250,
            align: "center",
            render: (value: any) => (
                <div style={{ textAlign: "left" }}>   {/* TD ชิดซ้าย */}
                    {value}
                </div>
            ),
        },
        { title: "PAYMENT TERMS", dataIndex: "paymentTerms", width: 150, align: "center" },
        { title: "DUE DATE", dataIndex: "duedate", width: 120, align: "center" },
        { title: "CURRENCY", dataIndex: "currency", width: 80, align: "center" },
        {
            title: "AMOUNT (BAHT)",
            dataIndex: "amtb",
            width: 180,
            align: "center",
            render: (value: any) => (
                <div style={{ textAlign: "right" }}>
                    {value ? Number(value).toLocaleString() : "-"}
                </div>
            ),
        },
        {
            title: "VAT IN",
            dataIndex: "vat",
            width: 120,
            align: "center",
            render: (value: any) => (
                <div style={{ textAlign: "right" }}>
                    {value !== null && value !== undefined
                        ? Number(value).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })
                        : "-"}
                </div>
            ),
        },
        {
            title: "W/H TAX RATE %",
            dataIndex: "whTaxRate",
            align: "center",
            width: 120,
            render: (val: any, record: any) => {
                const isDisabled =
                    record.documentNo !== null &&
                    record.documentNo !== undefined &&
                    record.documentNo !== "";

                return (
                    <Select
                        value={record.whTaxRate}
                        style={{
                            width: 90,
                            backgroundColor: isDisabled ? "#f5f5f5" : "#fffacd",
                        }}
                        placeholder="เลือก"
                        disabled={isDisabled}   // ✅ disable เมื่อมี Document
                        onChange={(value) => {
                            if (value === "ไม่หัก") {
                                setDataSource(prev =>
                                    prev.map(row => ({ ...row, whTaxRate: "ไม่หัก" }))
                                );
                            } else {
                                setDataSource(prev =>
                                    prev.map(row =>
                                        row.key === record.key
                                            ? { ...row, whTaxRate: `${value}%` }
                                            : row
                                    )
                                );
                            }
                        }}
                    >
                        <Select.Option value="1">1%</Select.Option>
                        <Select.Option value="2">2%</Select.Option>
                        <Select.Option value="3">3%</Select.Option>
                        <Select.Option value="5">5%</Select.Option>
                        <Select.Option value="ไม่หัก">ไม่หัก</Select.Option>
                    </Select>
                );
            },
        },
        {
            title: "W/H TAX",
            dataIndex: "whTaxRate",
            width: 120,
            align: "center", // TH อยู่กลาง
            render: (_: any, record: any) => {
                const whTax = calcWhTax(record);
                return (
                    <div style={{ textAlign: "right" }}>
                        {whTax.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </div>
                );
            }
        },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "totalAmount",
            width: 200,
            align: "center", // TH อยู่กลาง
            render: (_: any, record: any) => {
                const amtb = Number(record.amtb ?? 0);
                const vat = Number(record.vat ?? 0);
                const total = amtb + vat - calcWhTax(record);

                return (
                    <div style={{ textAlign: "right" }}>
                        {total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </div>
                );
            }
        },
        {
            title: (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>CONFIRM</span>
                    <Checkbox
                        checked={
                            selectedKeys.length === visibleData.length && visibleData.length > 0
                        }
                        indeterminate={
                            selectedKeys.length > 0 &&
                            selectedKeys.length < visibleData.length
                        }
                        onChange={(e) => {
                            const notSelected = visibleData.filter(row => !row.whTaxRate);
                            if (notSelected.length > 0) {
                                Swal.fire({
                                    icon: "warning",
                                    title: "กรุณาเลือก W/H TAX RATE ให้ครบทุกแถวก่อน",
                                    confirmButtonText: "OK",
                                });
                                return;
                            }
                            toggleSelectAll(e.target.checked);
                        }}
                    />
                </div>
            ),
            dataIndex: "confirm",
            width: 70,
            align: "center",
            render: (_: any, record: any) => (
                <Checkbox
                    disabled={!record.whTaxRate}
                    checked={selectedKeys.includes(record.key)}
                    onChange={(e) => {
                        if (!record.whTaxRate) {
                            Swal.fire({
                                icon: "warning",
                                title: "กรุณาเลือก W/H TAX RATE ก่อน!",
                                confirmButtonText: "OK",
                            });
                            return;
                        }

                        if (e.target.checked) {
                            setSelectedKeys([...selectedKeys, record.key]);
                        } else {
                            setSelectedKeys(selectedKeys.filter(k => k !== record.key));
                        }
                    }}
                />
            ),
        },
    ];

    const getGrandTotal = () => {
        const total = visibleData.reduce((sum, item) => {
            const amount = Number(item.amtb ?? 0);
            const vat = Number(item.vat ?? 0);
            return sum + (amount + vat - calcWhTax(item));
        }, 0);

        return total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };


    const getSelectedGrandTotal = () => {
        const total = visibleData.reduce((sum, item) => {
            const amount = Number(item.amtb ?? 0);
            const vat = Number(item.vat ?? 0);
            return sum + (amount + vat - calcWhTax(item));
        }, 0);

        return total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <FormOutlined style={{ fontSize: 28, marginRight: 10, color: "#1890ff" }} />
                <p style={{ fontWeight: 600, fontSize: 20, margin: 0 }}>Confirm Invoice</p>
            </div>

            <Divider style={{ borderColor: "#d0cdcd", marginTop: 8 }} />

            <div style={{ display: "flex", justifyContent: "center", margin: "2px 0 20px 0" }}>
                <Form layout="inline" style={{ alignItems: "center" }}>
                    <span style={{ marginRight: 10, fontWeight: 500, fontSize: 16 }}>Invoice date :</span>
                    <span style={{ marginRight: 10, fontWeight: 500, fontSize: 16 }}>From :</span>
                    <Form.Item>
                        <DatePicker
                            placeholder="From"
                            format="DD/MM/YYYY"
                            value={fromDate}
                            onChange={setFromDate}
                            style={{ height: 32 }}
                        />
                    </Form.Item>
                    <span style={{ margin: "0 10px", fontWeight: 500, fontSize: 14 }}>To :</span>
                    <Form.Item>
                        <DatePicker
                            placeholder="To"
                            format="DD/MM/YYYY"
                            value={toDate}
                            onChange={setToDate}
                            style={{ height: 32, width: 150 }}
                        />
                    </Form.Item>
                    <span style={{ margin: "0 10px", fontWeight: 500, fontSize: 14 }}>Invoice No :</span>
                    <Form.Item>
                        <input
                            type="text"
                            placeholder="Invoice No"
                            value={InvoiceNo}
                            onChange={(e) => setInvoiceNo(e.target.value)}
                            style={{ width: 250, height: 32, padding: "0 10px", borderRadius: 4, border: "1px solid #d9d9d9" }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={onSearch} loading={loading} style={{ height: 32, borderRadius: 6 }}>
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </div>



            <div style={{ maxHeight: 600, overflowY: "auto" }} className="customTable">
                <Table
                    columns={columns}
                    dataSource={visibleData}
                    scroll={{ x: "max-content", y: 600 }}
                    tableLayout="fixed"
                    sticky
                    bordered
                    pagination={false}
                    loading={{ spinning: loading, tip: "Loading...", size: "large" }}
                    summary={() => (
                        <Table.Summary fixed="bottom">
                            <Table.Summary.Row style={{ backgroundColor: "#fafafa", fontWeight: 700 }}>
                                <Table.Summary.Cell index={0} colSpan={11} align="center">
                                    Grand Total
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={11} align="right">
                                    {getGrandTotal()}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={12}></Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>

            {dataSource.length > 0 && (
                <p
                    style={{
                        marginTop: 10,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center"
                    }}
                >
                    <span style={{ color: "red" }}>*</span>&nbsp;Create By :
                    <input
                        type="text"
                        value={incharge}
                        onChange={(e) => setIncharge(e.target.value)}
                        style={{
                            width: 400,
                            height: 30,
                            marginLeft: 10,
                            padding: "0 10px",
                            borderRadius: 4,
                            border: "1px solid #d3d336",
                            backgroundColor: incharge ? "#fff" : "rgb(252 255 199)"
                        }}
                    />
                </p>
            )}

            {/* INVOICE CHECK */}
            {dataSource.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginTop: 20,
                        padding: "10px 20px",
                        borderTop: "1px solid #e5e5e5",
                        gap: 20,
                    }}
                >

                    <div>
                        {invoiceCheckList
                            .filter(item => item.dictkeyno === "INVCHECK01")
                            .map((item) => (
                                <Checkbox
                                    key={item.dictkeyno}
                                    checked={confirmStatus === item.dictkeyno}
                                    onChange={() => {
                                        setConfirmStatus(item.dictkeyno);
                                        setRemark(""); // ล้าง remark
                                    }}
                                    style={{ fontSize: 18, fontWeight: 500, color: "#28cd28" }}
                                >
                                    {item.dicttitle}
                                </Checkbox>
                            ))}
                    </div>


                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                        {invoiceCheckList
                            .filter(item => item.dictkeyno === "INVCHECK02")
                            .map((item) => (
                                <Checkbox
                                    key={item.dictkeyno}
                                    checked={confirmStatus === item.dictkeyno}
                                    onChange={() => setConfirmStatus(item.dictkeyno)}
                                    style={{ fontSize: 18, fontWeight: 500, color: "red" }}
                                >
                                    {item.dicttitle}
                                </Checkbox>
                            ))}

                        {confirmStatus === "INVCHECK02" && (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <label style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                                    Remark <span style={{ color: "red" }}>*</span>
                                </label>
                                <textarea
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    rows={3}
                                    style={{
                                        width: "500px",
                                        padding: 10,
                                        borderRadius: 6,
                                        border: "1px solid #d9d9d9",
                                        backgroundColor: remark ? "rgb(204 246 255)" : "rgb(252 255 199)",
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}


            {dataSource.length > 0 && confirmStatus === "INVCHECK01" && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                    <Button onClick={onConfirm} style={{ backgroundColor: "#52c41a", color: "#fff", borderRadius: 6, height: 40, fontSize: 18 }}>
                        ยืนยันยอดเงิน
                    </Button>
                </div>
            )}


            {confirmStatus === "INVCHECK02" && remark.trim() && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                    <Button onClick={onNotConfirm} style={{ backgroundColor: "red", color: "#fff", borderRadius: 6, height: 40, fontSize: 18 }}>
                        ยอดเงินไม่ถูกต้อง
                    </Button>
                </div>
            )}
        </div>
    );
}
