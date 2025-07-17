#!/usr/bin/env python3
"""Simple CLI to edit family_tree.json"""
import json
import argparse
import re
from pathlib import Path

ID_PATTERN = re.compile(r"^[a-z0-9-]+-\d{3}$")
REF_PATTERN = re.compile(r"^[A-Za-z]+ \d+:\d+(?:-\d+)?$")


def load(path):
    if Path(path).exists():
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []


def save(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)


def generate_id(name, existing):
    base = name.lower().replace(' ', '-')
    index = 1
    while True:
        cid = f"{base}-{index:03d}"
        if cid not in {p['id'] for p in existing}:
            return cid
        index += 1


def validate_refs(refs):
    for r in refs:
        if not REF_PATTERN.match(r):
            raise ValueError(f"Invalid reference format: {r}")


def add_person(args):
    data = load(args.file)
    pid = generate_id(args.name, data)
    validate_refs(args.references)
    person = {
        'id': pid,
        'name': args.name,
        'aliases': args.aliases,
        'children': [],
        'parents': args.parents,
        'references': args.references,
        'notes': args.notes
    }
    data.append(person)
    for parent in args.parents:
        for p in data:
            if p['id'] == parent:
                p.setdefault('children', []).append(pid)
    save(args.file, data)
    print(f"Added {pid}")


def delete_person(args):
    data = load(args.file)
    data = [p for p in data if p['id'] != args.id]
    for p in data:
        if args.id in p.get('children', []):
            p['children'].remove(args.id)
        if args.id in p.get('parents', []):
            p['parents'].remove(args.id)
    save(args.file, data)
    print(f"Deleted {args.id}")


def main():
    parser = argparse.ArgumentParser(description="Edit family tree data")
    parser.add_argument('--file', default=str(Path(__file__).resolve().parent.parent / 'data/family_tree.json'))
    sub = parser.add_subparsers(dest='cmd', required=True)

    a = sub.add_parser('add')
    a.add_argument('name')
    a.add_argument('--aliases', nargs='*', default=[])
    a.add_argument('--parents', nargs='*', default=[])
    a.add_argument('--references', nargs='*', default=[])
    a.add_argument('--notes', default='')
    a.set_defaults(func=add_person)

    d = sub.add_parser('delete')
    d.add_argument('id')
    d.set_defaults(func=delete_person)

    args = parser.parse_args()
    args.func(args)


if __name__ == '__main__':
    main()
