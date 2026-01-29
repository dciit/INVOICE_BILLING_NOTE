
import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Divider, Table, Select, Tag } from "antd";
import { FormOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import service from "../../service/account.service";
import svrMain from "../../service/confirm.service";
import { useSelector } from "react-redux";
import "../../css/InvoiceConfirm.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { color } from "framer-motion";
dayjs.extend(isBetween);

const { Option } = Select;

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
    vatIn?: string;
};

export default function EBilling_SummaryAC() {
    const auth = useSelector((state: any) => state.reducer.authen);
    const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().startOf("month"));
    const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<MData[]>([]);
    const [loading, setLoading] = useState(false);
    const [InvoiceNo, setInvoiceNo] = useState("");
    const visibleData = dataSource;
    const [vendor, setVendor] = useState<string>("%");
    const [vendorList, setVendorList] = useState<any[]>([]);
    const [status, setStatus] = useState<string>("%");
    const [ACType, setACType] = useState<string>("%");


    useEffect(() => {

    }, [auth.username]);


    useEffect(() => {
        svrMain.getVendor().then((res) => {
            try {
                setVendorList(res.data);
            } catch (error) {
                console.error(error);
            }
        });
    }, []);





    const onSearch = async () => {
        if (!fromDate || !toDate) {
            Swal.fire({
                icon: "warning",
                title: "Please select Document dates.",
            });
            return;
        }

        try {
            setLoading(true);
            const res = await service.SummaryAllinvoice({
                venderCode: vendor || "%",
                invoiceNo: InvoiceNo || "%",
                invoiceDateFrom: fromDate.format("YYYYMMDD"),
                invoiceDateTo: toDate.format("YYYYMMDD"),
                status: status,
                actype: ACType
            });


            const filtered = res.data.map((item: any, index: number) => ({
                key: index,
                no: index + 1,
                amtb: item.amtb,
                currency: item.currency,
                duedate: item.duedate,
                invoiceDate: item.invoicedate,
                invoiceNo: item.invoiceno,
                paymentTerms: item.paymenT_TERMS,
                vendorcode: item.vendorcode,
                vendorName: item.vendorname,
                status: item.status,
                vat: item.totalvat,
                whTaxRate: item.whtax,
                totalAmount: item.totaL_AMOUNT,
                actype: item.actype
            }));

            console.log("AAA", res.data)
            setDataSource(filtered);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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

    const columns = [
        {
            title: "NO",
            dataIndex: "no",
            width: 60,
            align: "center",
            fixed: "left",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "INVOICE NO", dataIndex: "invoiceNo", width: 180, align: "center", fixed: "left",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "INVOICE DATE", dataIndex: "invoiceDate", width: 120, align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "VENDER CODE", dataIndex: "vendorcode", width: 120, align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "VENDER NAME",
            dataIndex: "vendorName",
            width: 250,
            align: "center",
            render: (value: any) => <div style={{ textAlign: "left" }}>{value}</div>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "AC TYPE", dataIndex: "actype", width: 100, align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "PAYMENT TERMS", dataIndex: "paymentTerms", width: 150, align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "DUE DATE", dataIndex: "duedate", width: 120, align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "CURRENCY", dataIndex: "currency", width: 80, align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "AMOUNT (BAHT)",
            dataIndex: "amtb",
            width: 180,
            align: "center",
            render: (value: any) => <div style={{ textAlign: "right" }}>{value ? Number(value).toLocaleString() : "-"}</div>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "VAT IN",
            dataIndex: "vat",
            width: 120,
            align: "center",
            render: (value: any) => <div style={{ textAlign: "right" }}>{value ? Number(value).toLocaleString() : "-"}</div>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "W/H TAX RATE %", dataIndex: "whTaxRate", width: 120, align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "W/H TAX",
            dataIndex: "whTaxRate",
            width: 120,
            align: "center",
            render: (_: any, record: MData) => (
                <div style={{ textAlign: "right" }}>
                    {calcWhTax(record).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "totalAmount",
            width: 200,
            align: "center",
            render: (_: any, record: MData) => {
                const total = (Number(record.amtb ?? 0) + Number(record.vat ?? 0) - calcWhTax(record));
                return <div style={{ textAlign: "right" }}>{total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>;
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "STATUS",
            dataIndex: "status",
            width: 150,
            align: "center",
            fixed: "right", // ติดขวา
            render: (value: string) => {
                if (!value) return "-";

                const raw = value.trim();
                const status = raw.toLowerCase();

                if (status === "payment") {
                    return <Tag color="green">PAYMENT</Tag>;
                }

                if (status === "confirm") {
                    return <Tag color="blue">CONFIRM</Tag>;
                }

                if (raw.toUpperCase() === "WAITING_VENDOR") {
                    return <Tag color="orange">Waiting Vendor Confirm</Tag>;
                }

                if (raw.toUpperCase() === "WAITING_DCI") {
                    return <Tag color="gold">Waiting DCI Confirm</Tag>;
                }

                if (raw.toUpperCase() === "CANCEL_PAYMENT") {
                    return <Tag color="red">CANCEL PAYMENT</Tag>;
                }

                return <Tag>{value}</Tag>; // อื่นๆ แสดงตามเดิม
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "rgb(167 213 255)",
                    color: "black",
                    fontWeight: "bold",
                },
            }),
        },
    ];


    const getGrandTotal = () => {
        const total = visibleData.reduce((sum, item) => sum + (Number(item.amtb ?? 0) + Number(item.vat ?? 0) - calcWhTax(item)), 0);
        return total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <FormOutlined style={{ fontSize: 28, marginRight: 10, color: "#1890ff" }} />
                <p style={{ fontWeight: 600, fontSize: 20, margin: 0 }}>Summary Billing Report</p>
            </div>

            <Divider style={{ borderColor: "#d0cdcd", marginTop: 8 }} />

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Form layout="inline" style={{ alignItems: "center", marginBottom: 20 }}>
                    <span style={{ marginRight: 3, fontWeight: 500, fontSize: 14 }}>Invoice Date</span>
                    <span style={{ marginRight: 3, fontWeight: 500, fontSize: 14 }}>From :</span>
                    <Form.Item>
                        <DatePicker placeholder="From" format="DD/MM/YYYY" value={fromDate} onChange={setFromDate} style={{ height: 32, width: 120 }} />
                    </Form.Item>

                    <span style={{ margin: "0 3px", fontWeight: 500, fontSize: 14 }}>To :</span>
                    <Form.Item>
                        <DatePicker placeholder="To" format="DD/MM/YYYY" value={toDate} onChange={setToDate} style={{ height: 32, width: 120 }} />
                    </Form.Item>

                    <span style={{ margin: "0 3px", fontWeight: 500, fontSize: 14 }}>Select Vendor :</span>
                    <Form.Item>
                        <Select
                            showSearch
                            value={vendor}
                            onChange={setVendor}
                            style={{ width: 350, height: 32 }}
                            placeholder="เลือก Vendor"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            <Select.Option value="%">All</Select.Option>

                            {vendorList.map((item, index) => (
                                <Select.Option key={index} value={item.vender.trim()}>
                                    {item.vdname}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>




                    <span style={{ margin: "0 3px", fontWeight: 500, fontSize: 14 }}>Invoice No :</span>
                    <Form.Item>
                        <input type="text" value={InvoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} style={{ width: 180, height: 32, padding: "0 10px", borderRadius: 4, border: "1px solid #d9d9d9" }} />
                    </Form.Item>


                    <span style={{ margin: "0 3px", fontWeight: 500, fontSize: 14 }}>AC Type :</span>
                    <Form.Item>
                        <Select value={ACType} onChange={setACType} style={{ width: 200, height: 32 }}>
                            <Option value="%">ALL</Option>
                            <Option value="G">G : GENERAL PURCHASE</Option>
                            <Option value="O">O : OTHERS</Option>
                            <Option value="R">R : RAW MATERIAL</Option>
                        </Select>
                    </Form.Item>

                    <span style={{ margin: "0 3px", fontWeight: 500, fontSize: 14 }}>Status :</span>
                    <Form.Item>
                        <Select value={status} onChange={setStatus} style={{ width: 200, height: 32 }}>
                            <Option value="%">All</Option>
                            <Option value="WAITING_VENDOR">Waiting Vendor Confirm</Option>
                            <Option value="WAITING_DCI">Waiting DCI Confirm</Option>
                            <Option value="CONFIRM">Confirm</Option>
                            <Option value="REJECT">Reject</Option>
                            <Option value="PAYMENT">Payment</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={onSearch} loading={loading} style={{ height: 32, borderRadius: 6 }}>
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <div style={{ maxHeight: 700, overflowY: "auto" }} className="customTable">
                <Table
                    columns={columns}
                    dataSource={visibleData}
                    scroll={{ x: "max-content" }}
                    tableLayout="fixed"
                    sticky
                    bordered
                    pagination={false}
                    loading={{ spinning: loading, tip: "Loading...", size: "large" }}
                    rowClassName={(record: MData) => {
                        const raw = record.status?.trim();
                        const status = raw?.toLowerCase();

                        if (status === "payment") return "row-payment";
                        if (status === "confirm") return "row-confirm";
                        if (status === "waiting") return "row-waiting";
                        if (status === "reject") return "row-reject";
                        if (status === "cancel_payment") return "row-reject";

                        return "";
                    }}

                    summary={() => (
                        <Table.Summary fixed="bottom">
                            <Table.Summary.Row style={{ backgroundColor: "#fafafa", fontWeight: 700 }}>
                                <Table.Summary.Cell index={0} colSpan={13} align="center">
                                    Grand Total
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={13} align="right">
                                    {getGrandTotal()}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={14}></Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>

            <p className="mt-2 text-blue-800"> Total Record : {dataSource.length}</p>
        </div>
    );
}
